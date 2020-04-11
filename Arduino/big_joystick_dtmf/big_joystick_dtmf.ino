// Arduino USB Joystick HID demo
// Author: Darran Hunt
// Released into the public domain.
// Mod Jaime Jose Gavin Sierra
// EA1HLX
// DTMF MT8870 pin to gamepad buttons
// Arduino Uno R3 ATMEGA328 with ATMEGA 16u2 burn flip firmware big joystick
//  time_out_relay (Maximo tiempo de PTT activo en ms)
//  time_silence (Maximo tiempo de deteccion de silencio en ms)
//  time_delay (tiempo unidad principal de ms en espera)
//--------------------------------------------------------------------
//Usar use_relay_trigger_low o use_relay_trigger_high (no los 2 al mismo tiempo)
//Para activar rele por logica negada o no
#define use_relay_trigger_low
//#define use_relay_trigger_high

#define pin_dtmf_stq 2
#define pin_dtmf_q4 3
#define pin_dtmf_q3 4
#define pin_dtmf_q2 5
#define pin_dtmf_q1 6
#define pin_dtmf_relay 7

//Delay milliseconds
#define time_delay 100
//Maximo tiempo rele activo Timeout milisegundos 120 segundos (2 minutos) * 1000 ms = 120000 ms
#define time_out_relay 120000
//Tiempo maximo de silencio milisegundos 1 segundo 1000 ms
#define time_silence 1000

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
#define pad_relay 11 //boton indicando rele

byte stq,q4,q3,q2,q1;
bool switchFlip = false;
byte cont_switchFlip=0;
bool activarRelay = false;
bool DTMFactivo = false;
unsigned long relay_cont_time=0;
unsigned long relay_time_fin=0;
unsigned long silencio_cont_time=0;

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
void DesactivarPTT();


void setup() 
{
    pinMode(pin_dtmf_stq, INPUT);
    pinMode(pin_dtmf_q4, INPUT);
    pinMode(pin_dtmf_q3, INPUT);
    pinMode(pin_dtmf_q2, INPUT);
    pinMode(pin_dtmf_q1, INPUT);
    pinMode(pin_dtmf_relay, OUTPUT);

    #ifdef use_relay_trigger_low
     digitalWrite(pin_dtmf_relay,HIGH); //Dejar bajo  
    #endif
    #ifdef use_relay_trigger_high
     digitalWrite(pin_dtmf_relay,LOW); //Dejar bajo
    #endif
  
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


void DesactivarPTT()
{
 silencio_cont_time = 0;
 relay_cont_time = 0;
 activarRelay = false; 
 #ifdef use_relay_trigger_low
  digitalWrite(pin_dtmf_relay, HIGH); //Desactivar Rele
 #endif
 #ifdef use_relay_trigger_high
  digitalWrite(pin_dtmf_relay, LOW); //Desactivar Rele
 #endif 
 clearButton(&joyReport, pad_relay);
}


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
    

    //DTMF C es 15 1111
    if (q1 == HIGH && q2 == HIGH && q3 == HIGH && q4 == HIGH && stq == HIGH)
    {
     activarRelay = true;   
     relay_cont_time = 0;
    }
    
    DTMFactivo = (stq == HIGH)?true:false;

    if (activarRelay == true)
    {
     relay_cont_time ++;
     #ifdef use_relay_trigger_low
      digitalWrite(pin_dtmf_relay, LOW); //Activar Rele
     #endif    
     #ifdef use_relay_trigger_high
      digitalWrite(pin_dtmf_relay, HIGH); //Activar Rele
     #endif     
     setButton(&joyReport, pad_relay);
     relay_time_fin = relay_cont_time * time_delay; //milisegundos   
     if (relay_time_fin > time_out_relay)
     {
      DesactivarPTT();
     }
     else
     {
      if (DTMFactivo == false)
      {
       silencio_cont_time ++;
       if ((silencio_cont_time * time_delay) > time_silence)
       {
        DesactivarPTT();
       }
      }
      else
      {
        silencio_cont_time = 0; //reseteamos silencio    
      }
     }
    }
    else
    {   
     DesactivarPTT();
    }
    

    sendJoyReport(&joyReport);    
    delay(time_delay);
}
