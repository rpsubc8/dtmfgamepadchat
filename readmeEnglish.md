# DTMF CHAT
Sending of SMS's under DTMF tones, with real-time decoding using microphone or gamepad (MT8870 connected to joystick), under HTML5.
<center><img src='preview/previewChatTabRX.gif'></center>
<br>
<ul>
 <li><a href='#interface'>Interface<a/></li>
 <li><Href='#arduino'>ARDUINO HID<a/></li>  
 <li><a href='#opciones'>Options<a/></li>
 <li><a href='#codigo'>Code</a></li>
 <li><a href='#estado'>Project status<a/></li>
</ul>
<br>

<a name="interface"><h2>Interface</h2><a>
Several interfaces are allowed:
<ul>
 <li>Microphone or line input</li>
 <li>Line or speaker output</li>
 <li>Joystick or gamepad modified with MT8870</li>
 <li>Arduino emulating joystick (ARDUINO UNO)</li>
</ul>
Although using the MT8870 involves a little more difficulty, much more speed and accuracy is achieved in decoding DTMF tones.
Thanks to the MT8870 chip, connecting the STQ, Q4, Q3, Q2 and Q1 outputs to a transistor allows you to open or close
the buttons on a GAMEPAD, you can decode DTMF tones. We only need 5 pins (control buttons).
<center><img src='preview/interfacePAD.jpg'></center>
We will have to locate with multimeter the 5V of power supply of the USB of the control, to be able to feed the MT8870, as well as the mass in common.
<center><img src='preview/interfaceMT8870.gif'></center>
In this example, the control, we have chosen the following buttons, but they can vary, and we will have to take it into account in the application:
<ul>
 <li><b>STQ</b> (button 3)</li>
 <li><b>Q4</b> (button 5)</li>
 <li><b>Q3</b> (button 6)</li>
 <li><b>Q2</b> (button 9)</li>
 <li><b>Q1</b> (button 10)</li>
</ul>
<br><br>
 
<a name="arduino"><h2>ARDUINO HID</h2></a>
If you have an Arduino one R3 ATMEGA328 board with the ATMEGA 16u2 communications chip, you can use the modified big_joystick_dtmf code to emulate a 40 button HID joystick, which is activated by the MT8870 signals we have connected to the pins:
<center><img src="preview/arduinoHidJoystick.png"></center>
<ul>
 <li>stq - 2</li>
 <li>q4 - 3</li>
 <li>q3 - 4</li>
 <li>q2 - 5</li>
 <li>q1 - 6</li>
</ul> 

The buttons on the remote are:
<ul>
 <li>stq - 3</li>
 <li>q4 - 5</li>
 <li>q3 - 6</li>
 <li>q2 - 9</li>
 <li>q1 - 10</li>
</ul>

It is required to flash the ATMEGA16u2 chip with:

<a href='https://github.com/harlequin-tech/arduino-usb'>https://github.com/harlequin-tech/arduino-usb</a>

Use the FLIP tool and put the chip in DFU mode.
If we want other buttons, we will have to modify the ARDUINO code:
<pre><code>
#define pad_stq 2 // subtract 1
#define pad_q4 4
#define pad_q3 5
#define pad_q2 8
#define pad_q1 9
</code></pre>
It has been forced by code changes in the AXES to be equivalent to a button pressed, so that browsers detect it in the HTML5, and no button has to be pressed, since being an emulator with ARDUINO, it would be difficult to simulate.



<br><br>
<a name="html5"><h2>HTML5</h2></a>
HTML5 (js) has been chosen to achieve maximum portability. The current interface is not the definitive one, since something simple has been used for functionality tests.<br>
In HTML5 there are certain permission problems, both in the use of the microphone, as the GAMEPAD, which are solved differently, depending on browser and device.<br>
A typical problem with the gamepad is that you have to connect by usb and disconnect every time you have to use it or even that you have to press a button on the gamepad to accept permission on the first initialization.<br>
For the microphone, you need to give permission to use the microphone input.
We must adjust both the output and input levels, so that the tones are well detected.


<br><br>
<a name="options"><h2>Options</h2><a>
<center><img src='preview/captureOptions.gif'></center>
If we select the TabPAD button, we can access all the options:
<ul>
 <li>Gamepad (reads DTMF tones from gamepad)</li>
 <li>Microphone (reads DTMF tones from microphone or line input)</li>
 <li>PTT (D-tone number sent to activate VOX)</li>
 <li>Full Duplex (Allows decoding while sending)</li>
 <li>Log Debug (Write console log)</li>
 <li>Speed (DTMF sending speed)</li>
 <li>STQ (PAD button for MT8870 STQ pin)</li>
 <li>Q4 (PAD button for MT8870 pin Q4)</li>
 <li>Q3 (PAD button for MT8870 pin Q3)</li>
 <li>Q2 (PAD button for MT8870 pin Q2)</li>
 <li>Q1 (PAD button for MT8870 pin Q1)</li> 
</ul>
You can have the Gamepad and Microphone active at the same time to be able to decode both sites at the same time, but the normal thing is to have only one active site (the one we are going to use).<br>
The PTT is equivalent to sending the 'D' tone as many times as specified. This will allow you to open the VOX of a talkie.
The fullduplex is useful for testing, since it allows us a kind of ECO, if we make a sending to see in the equipment itself what is being received, but the normal thing is to have it deactivated while transmitting.
<br><br>
 
 
<a name="code"><h2>Code</h2><a>
If we select the code from the <b>sketch.js</b> we can modify certain variables, which are the options, in order to apply them directly, without having to do it from the application:
<pre><code>
 //Configurations
 var gb_cadPTT = 'DDDD'; //Activate PTT VOX tone number to be repeated
 var gb_log_debug = true; // Let's get RX and TX log true or false
 var gb_fullduplex = true; //RX and TX at the same time true or false
 var gb_use_gamepad_dtmf= true; //Allow MT8870 gamepad to read true or false
 var gb_use_mic_dtmf= false; //Permits reading of microphone true or false
 var gb_id_stq = 3; //Boton PAD for pin STQ MT8870
 var gb_id_q4 = 5; // PAD button for pin Q4 MT8870
 var gb_id_q3 = 6; // PAD button for pin Q3 MT8870
 var gb_id_q2 = 9; //Bottom PAD for pin Q2 MT8870
 var gb_id_q1 = 10; //Bottom PAD for pin Q1 MT8870
 var gb_speed_dtmf = 1; //Speed sent tones 1 .. 9 (MT8870 only)
</code></pre>
<br><br>

<a name="status"><h2>Project status</h2><a>
<ul>
 <li>Phase 1 - Simple Chat</li>
 <li>Phase 2 - Scaling up of (developing) services</li>
 <li>Phase 3 - Speed increase (in development)</li>
 <li>Phase 4 - Links (under development)</li>
</ul>
