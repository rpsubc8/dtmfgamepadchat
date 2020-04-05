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
 <li><Microphone or line input</li>
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
