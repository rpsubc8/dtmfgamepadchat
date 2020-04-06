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
// Arduino Leonrado
//--------------------------------------------------------------------
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

#include <Joystick.h>

byte stq,q4,q3,q2,q1;
bool switchFlip = false;
byte cont_switchFlip=0;
Joystick_ Joystick;

void setup() {  
  // Initialize Button Pins
  pinMode(pin_dtmf_stq, INPUT);
  pinMode(pin_dtmf_q4, INPUT);
  pinMode(pin_dtmf_q3, INPUT);
  pinMode(pin_dtmf_q2, INPUT);
  pinMode(pin_dtmf_q1, INPUT); 

  // Initialize Joystick Library
  Joystick.begin();
}

// Constant that maps the phyical pin to the joystick button.
//const int pinToButtonMap = 9;

// Last state of the button
//int lastButtonState[4] = {0,0,0,0};

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
   Joystick.setButton(pad_switchFlip, HIGH);
  else 
   Joystick.setButton(pad_switchFlip, LOW);
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

  delay(100);
}
