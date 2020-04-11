// Simple example application that shows how to read four Arduino
// digital pins and map them to the USB Joystick library.
//
// The digital pins 9, 10, 11, and 12 are grounded when they are pressed.
//
// NOTE: This sketch file is for use with Arduino Leonardo and
//       Arduino Micro only.
//
// by Matthew Heironimus
// 2015-11-20
// Mod Jaime Jose Gavin Sierra
// EA1HLX
// DTMF MT8870 pin to gamepad buttons
// Arduino Leonardo
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

#include <Joystick.h>

byte stq,q4,q3,q2,q1;
bool switchFlip = false;
byte cont_switchFlip=0;
bool activarRelay = false;
bool DTMFactivo = false;
unsigned long relay_cont_time=0;
unsigned long relay_time_fin=0;
unsigned long silencio_cont_time=0;
Joystick_ Joystick;

void setup() {  
  // Initialize Button Pins
  pinMode(pin_dtmf_stq, INPUT);
  pinMode(pin_dtmf_q4, INPUT);
  pinMode(pin_dtmf_q3, INPUT);
  pinMode(pin_dtmf_q2, INPUT);
  pinMode(pin_dtmf_q1, INPUT);
  pinMode(pin_dtmf_q1, INPUT);
  pinMode(pin_dtmf_relay, OUTPUT);

  #ifdef use_relay_trigger_low
   digitalWrite(pin_dtmf_relay,HIGH); //Dejar bajo  
  #endif
  #ifdef use_relay_trigger_high
   digitalWrite(pin_dtmf_relay,LOW); //Dejar bajo
  #endif
  
  // Initialize Joystick Library
  Joystick.begin();
}

// Constant that maps the phyical pin to the joystick button.
//const int pinToButtonMap = 9;

// Last state of the button
//int lastButtonState[4] = {0,0,0,0};

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
 Joystick.setButton(pad_relay, LOW);
}

void loop() {

  // Read pin values
  //for (int index = 0; index < 4; index++)
  //{
  //  int currentButtonState = !digitalRead(index + pinToButtonMap);
  //  if (currentButtonState != lastButtonState[index])
  //  {
  //    Joystick.setButton(index, currentButtonState);
  //    lastButtonState[index] = currentButtonState;
  //  }
  //}

  
  cont_switchFlip ++;
  if (cont_switchFlip % 10 == 0)
  {
   cont_switchFlip = 0;
   switchFlip = !switchFlip;
  }
  if (switchFlip == true)
  {  
   Joystick.setButton(pad_switchFlip, HIGH);
  }
  else
  {
   Joystick.setButton(pad_switchFlip, LOW);
  }
  
  q4 = digitalRead(pin_dtmf_q4);
  Joystick.setButton(pad_q4, q4);
  q3 = digitalRead(pin_dtmf_q3);
  Joystick.setButton(pad_q3, q3);
  q2 = digitalRead(pin_dtmf_q2);
  Joystick.setButton(pad_q2, q2);
  q1 = digitalRead(pin_dtmf_q1);
  Joystick.setButton(pad_q1, q1);
  stq  = digitalRead(pin_dtmf_stq);
  Joystick.setButton(pad_stq, stq);
  
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
   Joystick.setButton(pad_relay, HIGH);
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

  delay(time_delay);
}
