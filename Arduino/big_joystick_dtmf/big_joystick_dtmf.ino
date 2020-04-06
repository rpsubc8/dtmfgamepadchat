// Arduino USB Joystick HID demo
// Author: Darran Hunt
// Released into the public domain.
// Mod Jaime Jose Gavin Sierra
// EA1HLX
// DTMF MT8870 pin to gamepad buttons
// Arduino Uno R3 ATMEGA328 with ATMEGA 16u2 burn flip firmware big joystick


#define pin_dtmf_stq 2
#define pin_dtmf_q4 3
#define pin_dtmf_q3 4
#define pin_dtmf_q2 5
#define pin_dtmf_q1 6

//stq 3
//Q3 5
//Q3 6
//Q2 9
//Q1 10
#define pad_stq 2 //Le restamos 1
#define pad_q4 4
#define pad_q3 5
#define pad_q2 8
#define pad_q1 9
#define pad_switchFlip 10 //boton flipflop pulsado para activar navegador

byte stq,q4,q3,q2,q1;
bool switchFlip = false;
byte cont_switchFlip=0;

#undef DEBUG

#define NUM_BUTTONS	40
#define NUM_AXES	8	       // 8 axes, X, Y, Z, etc

typedef struct joyReport_t {
    int16_t axis[NUM_AXES];
    uint8_t button[(NUM_BUTTONS+7)/8]; // 8 buttons per byte
} joyReport_t;

joyReport_t joyReport;


void setup(void);
void loop(void);
void setButton(joyReport_t *joy, uint8_t button);
void clearButton(joyReport_t *joy, uint8_t button);
void sendJoyReport(joyReport_t *report);


void setup() 
{
    pinMode(pin_dtmf_stq, INPUT);
    pinMode(pin_dtmf_q4, INPUT);
    pinMode(pin_dtmf_q3, INPUT);
    pinMode(pin_dtmf_q2, INPUT);
    pinMode(pin_dtmf_q1, INPUT);                    
  
    Serial.begin(115200);
    delay(200);

    for (uint8_t ind=0; ind<8; ind++) 
    {
	   joyReport.axis[ind] = ind*1000;
    }
    for (uint8_t ind=0; ind<sizeof(joyReport.button); ind++) {
        joyReport.button[ind] = 0;
    }
}

// Send an HID report to the USB interface
void sendJoyReport(struct joyReport_t *report)
{
#ifndef DEBUG
    Serial.write((uint8_t *)report, sizeof(joyReport_t));
#else
    // dump human readable output for debugging
    for (uint8_t ind=0; ind<NUM_AXES; ind++) {
	Serial.print("axis[");
	Serial.print(ind);
	Serial.print("]= ");
	Serial.print(report->axis[ind]);
	Serial.print(" ");
    }
    Serial.println();
    for (uint8_t ind=0; ind<NUM_BUTTONS/8; ind++) {
	Serial.print("button[");
	Serial.print(ind);
	Serial.print("]= ");
	Serial.print(report->button[ind], HEX);
	Serial.print(" ");
    }
    Serial.println();
#endif
}

// turn a button on
void setButton(joyReport_t *joy, uint8_t button)
{
    uint8_t index = button/8;
    uint8_t bit = button - 8*index;

    joy->button[index] |= 1 << bit;
}

// turn a button off
void clearButton(joyReport_t *joy, uint8_t button)
{
    uint8_t index = button/8;
    uint8_t bit = button - 8*index;

    joy->button[index] &= ~(1 << bit);
}

//uint8_t button=0;	// current button
//bool press = true;	// turn buttons on?

/* Turn each button on in sequence 1 - 40, then off 1 - 40
 * add values to each axis each loop
 */
//byte i=0;



void loop() 
{
    // Turn on a different button each time
/*    if (press) {
	setButton(&joyReport, button);
    } else {
	clearButton(&joyReport, button);
    }*/

    // Move all of the axes
    //Fuerzo a mover para que oblique a pulsar y asi lo detecta el navegador en HTML5
    //for (uint8_t ind=0; ind<8; ind++) 
    //{
    //	joyReport.axis[ind]++;
    //  if (joyReport.axis[ind] > 200)
    //   joyReport.axis[ind] = 0;        
    //}

    //setButton(&joyReport, pad_stq);
    //setButton(&joyReport, pad_q4);
    //setButton(&joyReport, pad_q3);
    //setButton(&joyReport, pad_q2);
    //setButton(&joyReport, pad_q1);

    cont_switchFlip ++;
    if (cont_switchFlip % 10 == 0)
    {
     cont_switchFlip = 0;
     switchFlip = !switchFlip;
    }
    if (switchFlip == true)  
     setButton(&joyReport, pad_switchFlip);
    else 
     clearButton(&joyReport, pad_switchFlip);

    q4 = digitalRead(pin_dtmf_q4);
    if (q4 == HIGH)
     setButton(&joyReport, pad_q4);
    else 
     clearButton(&joyReport, pad_q4);

    q3 = digitalRead(pin_dtmf_q3);    
    if (q3 == HIGH)
     setButton(&joyReport, pad_q3);
    else 
     clearButton(&joyReport, pad_q3);

    q2 = digitalRead(pin_dtmf_q2);    
    if (q2 == HIGH)
     setButton(&joyReport, pad_q2);
    else 
     clearButton(&joyReport, pad_q2);    

    q1 = digitalRead(pin_dtmf_q1);    
    if (q1 == HIGH)
     setButton(&joyReport, pad_q1);
    else 
     clearButton(&joyReport, pad_q1);

    stq = digitalRead(pin_dtmf_stq);    
    if (stq == HIGH)
     setButton(&joyReport, pad_stq);
    else
     clearButton(&joyReport, pad_stq);
    

    sendJoyReport(&joyReport);    
    delay(100);
}
