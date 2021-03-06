//Autor: Jaime Jose Gavin Sierra
//EA1HLX
//Ackerman
//License WTFPL
//Chat over dtmf.
// Received gamepad MT8870 and Sound Card mic or line in
// Send: Sound Card
// # - Comienzo sms
//   - xxYYzz //Datos para Tipo 0
// * - Fin sms 
const const_max_length_sms = 64; //128 caracters maximos para un sms

//Configuraciones
var gb_cadPTT = 'DDDD';        //Activar PTT VOX numero de tono D a repetir
var gb_cadSilenceStart = ''    //Silencio despues de PTT (numero de veces a repetir)
var gb_cadSilenceEnd = ''      //Silencio antes de finalizar PTT (numero de veces a repetir)
var gb_cadNoiseEnd = ''        //Ruido antes de finalizar PTT (numero de veces a repetir)
var gb_log_debug = true;       //Sacamos log de RX y TX true o false
var gb_fullduplex = true;      //RX y TX al mismo tiempo true o false
var gb_use_gamepad_dtmf= false //Permite lectura de gamepad MT8870 true o false
var gb_use_mic_dtmf= true;     //Permite lectura de microfono true o false
var gb_id_stq = 3;             //Boton PAD para pin STQ MT8870
var gb_id_q4 = 5;              //Boton PAD para pin Q4 MT8870
var gb_id_q3 = 6;              //Boton PAD para pin Q3 MT8870
var gb_id_q2 = 9;              //Boton PAD para pin Q2 MT8870
var gb_id_q1 = 10;             //Boton PAD para pin Q1 MT8870
var gb_speed_dtmf = 1;         //Velocidad envio tonos 1 .. 9 (Solo MT8870)
var gb_use_sms = 3;            //Compresion SMS 0(crudo),1(diccionario mayusculas),2(LZW),3(auto)
var gb_use_relay = true;       //Rele Arduino activado por tono DTMF C



//Resto variables
var gb_medir_tx_ini; //Medir tiempo de transmision para Log
var gb_time_silence = 500;
var gb_time_sound = 300;

var value_stq,value_q4,value_q3,value_q2,value_q1;
var value_stq_antes,value_q4_antes,value_q3_antes,value_q2_antes,value_q1_antes;

var gb_cad_bit_dtmf='';
var stq_antes=0;
var gb_dato=0;
var gb_cadDTMF='';

var gb_ctrl_areaRX;
var gb_forceDraw = false;
var gb_cad_areaRX = '';
var gb_ctrl_areaTX;
var gb_ctrl_btnTabPAD;
var gb_ctrl_btnTabRX;

//var gb_ctrl_btnPruebaSendDTMF;
//var gb_ctrl_btnPruebaSendSMS0;
var gb_ctrl_btnPruebaSendTX0;
var gb_ctrl_btnPruebaSendSMS1;

var gb_ctrl_input_stq; //inputs pad buttons
var gb_ctrl_input_q4;
var gb_ctrl_input_q3;
var gb_ctrl_input_q2;
var gb_ctrl_input_q1;
var gb_ctrl_lbl_stq; //labels pad buttons
var gb_ctrl_lbl_q4;
var gb_ctrl_lbl_q3;
var gb_ctrl_lbl_q2;
var gb_ctrl_lbl_q1;
var gb_ctrl_btnClear;
var gb_ctrl_chkboxPAD; //checkbox gamepad
var gb_ctrl_chkboxMic; //checkbox  mic
var gb_ctrl_lbl_ptt; //label ptt
var gb_ctrl_input_ptt; //PTT activar VOX numero
var gb_ctrl_chkbox_fullduplex; //fullduplex
var gb_ctrl_chkbox_log; //Logger
var gb_ctrl_lbl_speed_dtmf; //Speed
var gb_ctrl_input_speed_dtmf; //Speed
var gb_ctrl_cmbSMS; //Combobox SMS 0,1,2,3
var gb_ctrl_chkboxRelay; //Rele externo activado por Arduino tono dtmf C
var gb_ctrl_lbl_silenceStart; //Silencio despues de apretar PTT
var gb_ctrl_input_silenceStart;
var gb_ctrl_lbl_silenceEnd;   //Silencio antes de soltar PTT
var gb_ctrl_input_silenceEnd;
var gb_ctrl_lbl_NoiseEnd;   //Ruido antes de soltar PTT
var gb_ctrl_input_NoiseEnd;



var gb_cad_botones='';

var gb_oscTone1;
var gb_oscTone2;
var gb_current_dtmf_send = 0;
var gb_total_dtmf_send = 0;
var gb_buf_send_dtmf = '';
var gb_play_dtmf= false;
var gb_begin_dtmf = false;
var gb_end_dtmf = false;
var gb_begin_silence = false;
var gb_end_silence = false;
var gb_ini_dtmf;  //Milisegundos inicial

var gb_mic;
var gb_fft;
var gb_fft_dtmf='';
var gb_fft_dtmf_antes='';
var gb_ini_fft_dtmf = false;
var gb_ini_fft_dtmf_time;

var gb_buf_rcv_dtmf = '' //string buffer recepcion 
var gb_event_new_data_dtmf= false;
var gb_begin_sync_dtmf= false;

var gb_begin_sms= false; //sms
var gb_end_sms= false;



//Rutina principal Setup inicial
function setup() {
 try
 {
  let resWidth = windowWidth;
  let resHeight = windowHeight;  
  let auxWidth = 0;
  let auxHeight = 0;
  let x_ini = 2;
  let y_ini = 2;
  let x = x_ini;
  let y = y_ini;
  createCanvas(resWidth, resHeight);
  textFont('Courier');
  textSize(20);
  
  PreLoadOscillator(); //Osciladores  
  ActivarMic(); //Preparar la captura de microfono	  

  gb_ctrl_areaRX = createElement('textarea');
  gb_ctrl_areaRX.position(x_ini,y_ini);  
  auxWidth = resWidth - x_ini - 40;
  gb_ctrl_areaRX.style('width',auxWidth.toString()+'px');
  auxHeight = Math.trunc(resHeight/2.2);
  gb_ctrl_areaRX.style('height',auxHeight.toString()+'px');
  gb_ctrl_areaRX.elt.value='';
  gb_ctrl_areaRX.elt.placeholder='';
  gb_ctrl_areaRX.elt.readOnly = true;
     
  value_stq= value_q4= value_q3= value_q2 = value_q1 = 0;
  //value_stq_antes = value_q4_antes = value_q3_antes = value_q2_antes = value_q1_antes = 0;  
    
  
  gb_ctrl_btnClear = createButton('Clear RX');
  x = Math.trunc(resWidth/1.4);
  y = Math.trunc(resHeight/1.75);    
  gb_ctrl_btnClear.position(x, y);
  gb_ctrl_btnClear.mousePressed(ClearDtmf);
   
  btnStop = createButton('Stop');  
  x = Math.trunc(resWidth/1.4);
  y = Math.trunc(resHeight/1.60);      
  btnStop.position(x,y);
  btnStop.mousePressed(StopSound);
    
  //gb_ctrl_btnPruebaSendDTMF = createButton('Send');
  //gb_ctrl_btnPruebaSendDTMF.position(220, 290);
  //gb_ctrl_btnPruebaSendDTMF.mousePressed(PruebaSendDTMF);
  
    
  gb_ctrl_areaTX = createElement('textarea');
  y = Math.trunc(resHeight/2.1) + y_ini;
  gb_ctrl_areaTX.position(x_ini,y);
  auxWidth = Math.trunc((resWidth - x_ini)/1.9) ;
  gb_ctrl_areaTX.style('width', auxWidth.toString()+'px');
  gb_ctrl_areaTX.style('height','30px');
  gb_ctrl_areaTX.elt.maxLength = const_max_length_sms;
  gb_ctrl_areaTX.elt.placeholder='';
  
  gb_ctrl_btnPruebaSendTX0 = createButton('Send TX');
  x = Math.trunc(resWidth/1.75);
  y = Math.trunc(resHeight/2.05);
  gb_ctrl_btnPruebaSendTX0.position(x, y);
  gb_ctrl_btnPruebaSendTX0.mousePressed(function(){SendTXSMSTipo(gb_use_sms)});	


  //gb_ctrl_btnPruebaSendSMS0 = createButton('SendSMS0');
  //x = Math.trunc(resWidth/1.4);
  //y = Math.trunc(resHeight/2.1);  
  //gb_ctrl_btnPruebaSendSMS0.position(x, y);
  //gb_ctrl_btnPruebaSendSMS0.mousePressed(function(){SendSMSTipo0('HOLA')});
  
  
  gb_ctrl_cmbSMS = createSelect();
  x = Math.trunc(resWidth/1.4);
  y = Math.trunc(resHeight/2.1);  
  gb_ctrl_cmbSMS.position(x, y);
  gb_ctrl_cmbSMS.option('0.RAW');
  gb_ctrl_cmbSMS.option('1.Diccionario');
  gb_ctrl_cmbSMS.option('2.LZW');
  gb_ctrl_cmbSMS.option('3.Auto');
  switch (gb_use_sms)
  {
   case 0: gb_ctrl_cmbSMS.selected('0.RAW'); //Base64 crudo
    break;
   case 1: gb_ctrl_cmbSMS.selected('1.Diccionario'); //Diccionario, empaqueta, mayusculas Base64
    break;
   case 2: gb_ctrl_cmbSMS.selected('2.LZW'); //LZW Base64
    break;
   case 3: gb_ctrl_cmbSMS.selected('3.Auto'); //Auto 0,1,2,3
    break;		
   default: gb_ctrl_cmbSMS.selected('0.Sin comprimir');
    break;
  }
  gb_ctrl_cmbSMS.changed(UseSMSEvent);  
  
  //gb_ctrl_btnPruebaSendSMS1 = createButton('SendSMS1');
  //x = Math.trunc(resWidth/1.4);
  //y = Math.trunc(resHeight/1.9);
  //gb_ctrl_btnPruebaSendSMS1.position(x, y);
  //gb_ctrl_btnPruebaSendSMS1.mousePressed(function(){SendSMSTipo1('HOLA QUE TAL')});
  

  gb_ctrl_lbl_stq = createElement('h4', 'STQ'); //label
  gb_ctrl_lbl_stq.position(20,180);  
  gb_ctrl_input_stq = createInput(gb_id_stq.toString(),'number'); //input
  gb_ctrl_input_stq.position(60, 200);
  gb_ctrl_input_stq.style('width','40px');
  gb_ctrl_input_stq.elt.min = 0;
  gb_ctrl_input_stq.elt.max = 99;
  gb_ctrl_input_stq.input(LoadBotones);
  gb_ctrl_input_stq.elt.value = gb_id_stq.toString();

  gb_ctrl_lbl_q4 = createElement('h4', 'Q4'); //label
  gb_ctrl_lbl_q4.position(20,210);
  gb_ctrl_input_q4 = createInput(gb_id_q4.toString(),'number'); //input
  gb_ctrl_input_q4.position(60, 230);
  gb_ctrl_input_q4.style('width','40px');
  gb_ctrl_input_q4.elt.min = 0;
  gb_ctrl_input_q4.elt.max = 99;
  gb_ctrl_input_q4.input(LoadBotones);
  gb_ctrl_input_q4.elt.value = gb_id_q4.toString();

  gb_ctrl_lbl_q3 = createElement('h4', 'Q3'); //label
  gb_ctrl_lbl_q3.position(20,240);
  gb_ctrl_input_q3 = createInput(gb_id_q3.toString(),'number'); //input
  gb_ctrl_input_q3.position(60, 260);
  gb_ctrl_input_q3.style('width','40px');
  gb_ctrl_input_q3.elt.min = 0;
  gb_ctrl_input_q3.elt.max = 99;  
  gb_ctrl_input_q3.input(LoadBotones);
  gb_ctrl_input_q3.elt.value = gb_id_q3.toString();
  
  gb_ctrl_lbl_q2 = createElement('h4', 'Q2'); //label
  gb_ctrl_lbl_q2.position(20,270);
  gb_ctrl_input_q2 = createInput(gb_id_q2.toString(),'number'); //input
  gb_ctrl_input_q2.position(60, 290);
  gb_ctrl_input_q2.style('width','40px');
  gb_ctrl_input_q2.elt.min = 0;
  gb_ctrl_input_q2.elt.max = 99;    
  gb_ctrl_input_q2.input(LoadBotones);
  gb_ctrl_input_q2.elt.value = gb_id_q2.toString();
  
  gb_ctrl_lbl_q1 = createElement('h4', 'Q1'); //label
  gb_ctrl_lbl_q1.position(20,300);
  gb_ctrl_input_q1 = createInput(gb_id_q1.toString(),'number'); //input
  gb_ctrl_input_q1.position(60, 320);
  gb_ctrl_input_q1.style('width','40px');
  gb_ctrl_input_q1.elt.min = 0;
  gb_ctrl_input_q1.elt.max = 99;    
  gb_ctrl_input_q1.input(LoadBotones);
  gb_ctrl_input_q1.elt.value = gb_id_q1.toString();
      
	  	 

  gb_ctrl_btnTabRX = createButton('TABRX');
  gb_ctrl_btnTabRX.position(10,400);
  gb_ctrl_btnTabRX.mousePressed(SelectTabRX);
  
  gb_ctrl_btnTabPAD = createButton('TABPAD');
  gb_ctrl_btnTabPAD.position(80,400);
  gb_ctrl_btnTabPAD.mousePressed(SelectTabPAD);  
  
  gb_ctrl_chkboxPAD = createCheckbox('GAMEPAD', gb_use_gamepad_dtmf); //checkbox joystick
  gb_ctrl_chkboxPAD.position(20,20);
  gb_ctrl_chkboxPAD.changed(GamePADEvent);
  
  gb_ctrl_chkboxMic = createCheckbox('Micrófono', gb_use_mic_dtmf);//checkbox mic
  gb_ctrl_chkboxMic.position(20,50);
  gb_ctrl_chkboxMic.changed(MicEvent);

  gb_ctrl_lbl_ptt = createElement('h4', 'PTT'); //label
  gb_ctrl_lbl_ptt.position(20,60);
  gb_ctrl_input_ptt = createInput(gb_cadPTT.length.toString(),'number'); //PTT num D a enviar
  gb_ctrl_input_ptt.position(60, 80);
  gb_ctrl_input_ptt.style('width','40px');
  gb_ctrl_input_ptt.elt.min = 0;
  gb_ctrl_input_ptt.elt.max = 16;    
  gb_ctrl_input_ptt.input(UpdateNumPTT);
  gb_ctrl_input_ptt.elt.value = gb_cadPTT.length.toString();
  
  gb_ctrl_lbl_silenceStart = createElement('h4', 'Silence Start'); //label
  gb_ctrl_lbl_silenceStart.position(200,60);
  gb_ctrl_input_silenceStart = createInput(gb_cadSilenceStart.length.toString(),'number');
  gb_ctrl_input_silenceStart.position(290, 80);
  gb_ctrl_input_silenceStart.style('width','40px');
  gb_ctrl_input_silenceStart.elt.min = 0;
  gb_ctrl_input_silenceStart.elt.max = 16;    
  gb_ctrl_input_silenceStart.input(UpdateSilenceStart);
  gb_ctrl_input_silenceStart.elt.value = gb_cadSilenceStart.length.toString();
  
  gb_ctrl_lbl_silenceEnd = createElement('h4', 'Silence End'); //label
  gb_ctrl_lbl_silenceEnd.position(200,90);
  gb_ctrl_input_silenceEnd = createInput(gb_cadSilenceEnd.length.toString(),'number');
  gb_ctrl_input_silenceEnd.position(290, 110);
  gb_ctrl_input_silenceEnd.style('width','40px');
  gb_ctrl_input_silenceEnd.elt.min = 0;
  gb_ctrl_input_silenceEnd.elt.max = 16;    
  gb_ctrl_input_silenceEnd.input(UpdateSilenceEnd);
  gb_ctrl_input_silenceEnd.elt.value = gb_cadSilenceEnd.length.toString();
  
  gb_ctrl_lbl_NoiseEnd = createElement('h4', 'Noise End'); //label ruido antes de soltar PTT
  gb_ctrl_lbl_NoiseEnd.position(200,120);
  gb_ctrl_input_NoiseEnd = createInput(gb_cadNoiseEnd.length.toString(),'number');
  gb_ctrl_input_NoiseEnd.position(290, 140);
  gb_ctrl_input_NoiseEnd.style('width','40px');
  gb_ctrl_input_NoiseEnd.elt.min = 0;
  gb_ctrl_input_NoiseEnd.elt.max = 16;    
  gb_ctrl_input_NoiseEnd.input(UpdateNoiseEnd);
  gb_ctrl_input_NoiseEnd.elt.value = gb_cadNoiseEnd.length.toString();  
  
  
  gb_ctrl_chkbox_fullduplex = createCheckbox('Full duplex', gb_fullduplex); //TX y RX al mismo tiempo
  gb_ctrl_chkbox_fullduplex.position(20,110);
  gb_ctrl_chkbox_fullduplex.changed(FullDuplexEvent);  
  
  gb_ctrl_chkbox_log = createCheckbox('Log Debug', gb_log_debug); //TX y RX al mismo tiempo
  gb_ctrl_chkbox_log.position(20,140);
  gb_ctrl_chkbox_log.changed(LogDebugEvent);
  
  gb_ctrl_lbl_speed_dtmf = createElement('h4', 'Vel'); //label
  gb_ctrl_lbl_speed_dtmf.position(20,150);
  gb_ctrl_input_speed_dtmf = createInput(gb_speed_dtmf.toString(),'number'); //input
  gb_ctrl_input_speed_dtmf.position(60, 170);
  gb_ctrl_input_speed_dtmf.style('width','40px');
  gb_ctrl_input_speed_dtmf.elt.min = 1;
  gb_ctrl_input_speed_dtmf.elt.max = 9;    
  gb_ctrl_input_speed_dtmf.input(SpeedEvent);
  gb_ctrl_input_speed_dtmf.elt.value = gb_speed_dtmf.toString();  
  SpeedEvent(); //Fuerza la velocidad leida


  gb_ctrl_chkboxRelay = createCheckbox('Relay PTT', gb_use_relay); //checkbox relay PTT
  gb_ctrl_chkboxRelay.position(200,20);
  gb_ctrl_chkboxRelay.changed(RelayEvent);

  SelectTabRX(); //Seleccion Recepcion
	  
  gb_forceDraw = true;
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }
}

//Numero de ruido C despues de apretar PTT
function UpdateNoiseEnd()
{
 try
 {
  let numNoise = Number(gb_ctrl_input_NoiseEnd.elt.value);
  let i=0;
  gb_cadNoiseEnd = '';
  for (i=0;i<numNoise;i++)
  {	  
   gb_cadNoiseEnd += 'D';
  }
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 } 		
}

//Numero de silencios despues de apretar PTT
function UpdateSilenceStart()
{
 try
 {
  let numSilence = Number(gb_ctrl_input_silenceStart.elt.value);
  let i=0;
  gb_cadSilenceStart = '';
  for (i=0;i<numSilence;i++)
  {	  
   gb_cadSilenceStart += ' ';
  }
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 } 	
}

//Numero de silencios antes de soltar PTT
function UpdateSilenceEnd()
{
 try
 {
  let numSilence = Number(gb_ctrl_input_silenceEnd.elt.value);
  let i=0;
  gb_cadSilenceEnd = '';
  for (i=0;i<numSilence;i++)
  {	  
   gb_cadSilenceEnd += ' ';
  }
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 } 	
}

//Usar Relé activar PTT arduino
function RelayEvent()
{
 try
 {  
  gb_use_relay = this.checked() ? true : false;  
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 } 
}

//Usar compresion SMS
function UseSMSEvent()
{
 try
 {
  gb_use_sms = Number(this.elt.value.substr(0,1));
  //alert (gb_use_sms);
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }
}

//Velocidad envio tonos
function SpeedEvent()
{
 try
 {
  gb_speed_dtmf = Number(gb_ctrl_input_speed_dtmf.elt.value);  
  switch (gb_speed_dtmf)
  {
   case 1: gb_time_silence = 500; gb_time_sound = 300;
    break;
   case 2: gb_time_silence = 450; gb_time_sound = 300;
    break;
   case 3: gb_time_silence = 400; gb_time_sound = 300;
    break;
   case 4: gb_time_silence = 350; gb_time_sound = 300;
    break;
   case 5: gb_time_silence = 300; gb_time_sound = 300;
    break;
   case 6: gb_time_silence = 250; gb_time_sound = 200;
    break;
   case 6: gb_time_silence = 200; gb_time_sound = 200;
    break;
   case 6: gb_time_silence = 200; gb_time_sound = 175;
    break;
   case 7: gb_time_silence = 150; gb_time_sound = 175;
    break;	
   case 8: gb_time_silence = 150; gb_time_sound = 150;
    break;
   case 9: gb_time_silence = 100; gb_time_sound = 100;
    break;	
   default: gb_time_silence = 500; gb_time_sound = 300;
    break;
  }  
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }  
}

//Prepara los 2 tonos de los osciladores
function PreLoadOscillator()
{
 try
 {
  gb_oscTone1 = new p5.Oscillator();
  gb_oscTone1.setType('sine');
  gb_oscTone1.freq(697);
  gb_oscTone1.amp(1);
  gb_oscTone2 = new p5.Oscillator();
  gb_oscTone2.setType('sine');
  gb_oscTone2.freq(1209);
  gb_oscTone2.amp(1);
  //gb_oscTone2.start();	    
  //gb_oscTone1.start();
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }  
}

//Activa microfono si no existe primer vez
function ActivarMic()
{
 try
 {
  if (gb_use_mic_dtmf === true)
  {
   if ((typeof gb_mic === 'undefined') || (typeof gb_fft === 'undefined'))
   {
    gb_mic = new p5.AudioIn();
    gb_mic.start();
    gb_fft = new p5.FFT();
    gb_fft.setInput(gb_mic);  	  
   }
  }
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }
}



//Seleccion Mic decodificar tonos DTMF
function MicEvent()
{
 try
 {
  gb_use_mic_dtmf = this.checked() ? true : false;
  ActivarMic();
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }  
}

//Seleccion de GAMEPAD para leer MT8870 tonos DTMF
function GamePADEvent()
{
 try
 {
  gb_use_gamepad_dtmf = this.checked() ? true : false;
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }  	
}

//Fullduplex RX y TX al mismo tiempo ECO de lo enviado
function FullDuplexEvent()
{
 try
 {
  gb_fullduplex = this.checked() ? true : false;
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }  
}

//Chequeado checkbos logdebug
function LogDebugEvent()
{
 try
 {    
  gb_log_debug = this.checked() ? true : false;
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 } 
}

//Imprime consola log si tenemos activa gb_log_debug
function DebugLog(cad)
{
 try
 {
  if (gb_log_debug === true)
  {
   console.log(cad);
  }
 }
 catch(err)
 {  
 } 
}

//Numero de D para activar VOX PTT
function UpdateNumPTT()
{
 try
 {
  let numPTT = Number(gb_ctrl_input_ptt.elt.value);
  let i=0;
  gb_cadPTT = '';
  for (i=0;i<numPTT;i++)
  {	  
   gb_cadPTT += 'D';
  }
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 } 
}

//Reproduce un tono DTMF dado
function PlayDTMF(data)
{   
 try
 {
  //gb_buf_send_dtmf[0] = data;
  gb_buf_send_dtmf = data;
  gb_total_dtmf_send= 0;
  gb_current_dtmf_send = 0;
  gb_play_dtmf= true;
  gb_begin_dtmf = false;
  gb_end_dtmf = false;
  gb_begin_silence = false;
  gb_end_silence = false;
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Para reproducir sonidos DTMF
function StopSound(){
 try
 { 
  gb_oscTone1.stop();
  gb_oscTone2.stop();
  gb_play_dtmf = false;
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

function ClearDtmf(){
 try
 {
  gb_ctrl_areaRX.elt.value ='';
  gb_cad_areaRX='';
  gb_forceDraw = true; 
  //alert(StringTo2KeyDTMF('esto es una prueba'));
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Convierte caracter Base64 A..Z a codigo decimal 0..63
function CharBase64To2DTMF(car)
{
 let aReturn = '';
 try
 {
  switch(car)
  {  
   case 'A': aReturn='00'; break;
   case 'B': aReturn='01'; break;
   case 'C': aReturn='02'; break;
   case 'D': aReturn='03'; break;
   case 'E': aReturn='04'; break;
   case 'F': aReturn='05'; break;
   case 'G': aReturn='06'; break;
   case 'H': aReturn='07'; break;
   case 'I': aReturn='08'; break;
   case 'J': aReturn='09'; break;
   case 'K': aReturn='10'; break;
   case 'L': aReturn='11'; break;
   case 'M': aReturn='12'; break;
   case 'N': aReturn='13'; break;
   case 'O': aReturn='14'; break;
   case 'P': aReturn='15'; break;
   case 'Q': aReturn='16'; break;
   case 'R': aReturn='17'; break;
   case 'S': aReturn='18'; break;
   case 'T': aReturn='19'; break;
   case 'U': aReturn='20'; break;
   case 'V': aReturn='21'; break;
   case 'W': aReturn='22'; break;
   case 'X': aReturn='23'; break;
   case 'Y': aReturn='24'; break;
   case 'Z': aReturn='25'; break;
   case 'a': aReturn='26'; break;
   case 'b': aReturn='27'; break;
   case 'c': aReturn='28'; break;
   case 'd': aReturn='29'; break;
   case 'e': aReturn='30'; break;
   case 'f': aReturn='31'; break;
   case 'g': aReturn='32'; break;
   case 'h': aReturn='33'; break;
   case 'i': aReturn='34'; break;
   case 'j': aReturn='35'; break;
   case 'k': aReturn='36'; break;
   case 'l': aReturn='37'; break;
   case 'm': aReturn='38'; break;
   case 'n': aReturn='39'; break;
   case 'o': aReturn='40'; break;
   case 'p': aReturn='41'; break;
   case 'q': aReturn='42'; break;
   case 'r': aReturn='43'; break;
   case 's': aReturn='44'; break;
   case 't': aReturn='45'; break;
   case 'u': aReturn='46'; break;
   case 'v': aReturn='47'; break;
   case 'w': aReturn='48'; break;
   case 'x': aReturn='49'; break;
   case 'y': aReturn='50'; break;
   case 'z': aReturn='51'; break;
   case '0': aReturn='52'; break;
   case '1': aReturn='53'; break;
   case '2': aReturn='54'; break;
   case '3': aReturn='55'; break;
   case '4': aReturn='56'; break;
   case '5': aReturn='57'; break;
   case '6': aReturn='58'; break;
   case '7': aReturn='59'; break;
   case '8': aReturn='60'; break;
   case '9': aReturn='61'; break;
   case '+': aReturn='62'; break;
   case '/': aReturn='63'; break;
   default: aReturn=''; break;
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
 return aReturn;
}

//Convierte de 2 DTMF a Base64
function DTMFtoCharBase64(dtmf)
{
 let aReturn = '';
 try
 {
  switch(dtmf)
  {  
   case '00': aReturn='A'; break;
   case '01': aReturn='B'; break;
   case '02': aReturn='C'; break;
   case '03': aReturn='D'; break;
   case '04': aReturn='E'; break;
   case '05': aReturn='F'; break;
   case '06': aReturn='G'; break;
   case '07': aReturn='H'; break;
   case '08': aReturn='I'; break;
   case '09': aReturn='J'; break;
   case '10': aReturn='K'; break;
   case '11': aReturn='L'; break;
   case '12': aReturn='M'; break;
   case '13': aReturn='N'; break;
   case '14': aReturn='O'; break;
   case '15': aReturn='P'; break;
   case '16': aReturn='Q'; break;
   case '17': aReturn='R'; break;
   case '18': aReturn='S'; break;
   case '19': aReturn='T'; break;
   case '20': aReturn='U'; break;
   case '21': aReturn='V'; break;
   case '22': aReturn='W'; break;
   case '23': aReturn='X'; break;
   case '24': aReturn='Y'; break;
   case '25': aReturn='Z'; break;
   case '26': aReturn='a'; break;
   case '27': aReturn='b'; break;
   case '28': aReturn='c'; break;
   case '29': aReturn='d'; break;
   case '30': aReturn='e'; break;
   case '31': aReturn='f'; break;
   case '32': aReturn='g'; break;
   case '33': aReturn='h'; break;
   case '34': aReturn='i'; break;
   case '35': aReturn='j'; break;
   case '36': aReturn='k'; break;
   case '37': aReturn='l'; break;
   case '38': aReturn='m'; break;
   case '39': aReturn='n'; break;
   case '40': aReturn='o'; break;
   case '41': aReturn='p'; break;
   case '42': aReturn='q'; break;
   case '43': aReturn='r'; break;
   case '44': aReturn='s'; break;
   case '45': aReturn='t'; break;
   case '46': aReturn='u'; break;
   case '47': aReturn='v'; break;
   case '48': aReturn='w'; break;
   case '49': aReturn='x'; break;
   case '50': aReturn='y'; break;
   case '51': aReturn='z'; break;
   case '52': aReturn='0'; break;
   case '53': aReturn='1'; break;
   case '54': aReturn='2'; break;
   case '55': aReturn='3'; break;
   case '56': aReturn='4'; break;
   case '57': aReturn='5'; break;
   case '58': aReturn='6'; break;
   case '59': aReturn='7'; break;
   case '60': aReturn='8'; break;
   case '61': aReturn='9'; break;
   case '62': aReturn='+'; break;
   case '63': aReturn='/'; break;
   default: aReturn=''; break;
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
 return aReturn;
}

//Envia un mensaje del TextMemo
function SendTXSMSTipo(tipo)
{
 try
 { 
  let cadToSend = gb_ctrl_areaTX.elt.value;
  switch (tipo)
  {
   case 0: SendSMSTipo0(cadToSend); //Texto Base64 crudo
    break;
   case 1: SendSMSTipo1Serv(cadToSend,'0'); //Diccionario,empaquetado,mayusculas
    break;
   case 2: SendSMSTipo1Serv(cadToSend,'2'); //LZW Base64
    break;
   case 3: let len = btoa(cadToSend).length; //longitud cadena normal Base64
    let len0 = btoa(TextoComprimeDiccionario(cadToSend)).length; //longitud diccionario mayusculas Base64
	let len2 = LZString.compressToBase64(cadToSend).length; //longitud LZW Base64
	if (len <= len0 && len <= len2)
	{
	 SendSMSTipo0(cadToSend); //Normal
	}
	else
	{
	 if (len0 <= len && len0 <= len2)
	 {
	  SendSMSTipo1Serv(cadToSend,'0'); //diccionario
	 }
	 else
	 {
	  SendSMSTipo1Serv(cadToSend,'2'); //LZW
	 }
	}    
    break;   
   default: SendSMSTipo0(cadToSend);
    break;
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Actualiza la area de recepcion que tambien pone TX
function UpdateAreaRX(cad)
{
 try
 {
  gb_ctrl_areaRX.elt.value += cad+'\n';
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Send SMS de Prueba basica tipo 0 sin longitud ni CRC
function SendSMSTipo0(cadToSend)
{
 //#0323334*
 //gb_buf_send_dtmf[0]='#'; 
 try
 {
  gb_buf_send_dtmf = (gb_use_relay === true) ? 'C' : '';
  gb_buf_send_dtmf += gb_cadPTT + gb_cadSilenceStart + '#';
  //gb_buf_send_dtmf = '#';
  let cadLog = '';
  let frameData = '0'; //Tipo 0
  let cadTX = '';
  //let cadSend = '323334'; 
  //let cadToSend = 'HOLA';
 
  let encodedString = btoa(cadToSend); //Base64  
  cadLog += new Date(Date.now()).toLocaleString('en-GB').replace(',','');
  cadTX = cadLog;
  cadLog += ' TX Type:0 '+cadToSend+' Len:'+cadToSend.length.toString();
  cadLog += ' BASE64:'+encodedString+ ' Len:'+encodedString.length.toString();
  let cadDTMF = '';
  let i=0;
  for (i=0;i<encodedString.length;i++)
  {	 
   cadDTMF += CharBase64To2DTMF(encodedString[i]);
  }
  cadLog += ' DTMF:' + cadDTMF+' Len:'+cadDTMF.length.toString();  
  //DebugLog(cadLog);
 
  cadTX+=' TX(0):'+cadToSend;
  UpdateAreaRX(cadTX);
 
  frameData += cadDTMF;
  for (i=1;i<=frameData.length;i++){
   //gb_buf_send_dtmf[i] = frameData[(i-1)];
   gb_buf_send_dtmf += frameData[(i-1)];
  }
  //gb_buf_send_dtmf[(frameData.length+1)]='*';
  gb_buf_send_dtmf += '*';
  gb_buf_send_dtmf += gb_cadSilenceEnd + gb_cadNoiseEnd;
  
  cadLog += ' Frame:'+gb_buf_send_dtmf+' Len:'+gb_buf_send_dtmf.length.toString();
  DebugLog(cadLog);
 
  //gb_total_dtmf_send= frameData.length+1;
  gb_total_dtmf_send = gb_buf_send_dtmf.length;
  gb_current_dtmf_send = 0;
  gb_play_dtmf= true;
  gb_begin_dtmf = false;
  gb_end_dtmf = false;
  gb_begin_silence = false;
  gb_end_silence = false;
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Genera CRC de todo el frame a enviar
function FrameGenerateCRC(frameOrigen)
{
 let aReturn = '00';
 let aux = 0;
 try
 {
  let i = 0;
  for (i=0; i<frameOrigen.length; i++)
  {
   aux += Number(frameOrigen[i]);   
  }
  if (aux > 63)
  {
   aux = aux % 64;
  }
  aReturn = aux.toString().padStart(2,'0');
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return aReturn;
}

//Send SMS de Prueba basica tipo 1 con longitud y CRC
function SendSMSTipo1Serv(cadToSend, servicio)
{
 //#10CRxxYYzz*
 //Tipo:1  
 //Servicio:0 Diccionario Espaniol
 //Longitud 00
 //CRC 00
 try
 {
  gb_buf_send_dtmf = (gb_use_relay === true) ? 'C' : '';
  gb_buf_send_dtmf += gb_cadPTT + gb_cadSilenceStart + '#';
  let cadLog = '';
  let frameData = '1'; //Tipo 1
  let cadLen = '00'; //Longitud
  let cadCRC = '00';   //CRC
  let cadTX = '';
  //let cadServ = '0'; //Servicio 0 //Diccionario Espaniol
  let cadServ = servicio;
  let cadCompress = '';
  let cadDTMF = '';
  let encodedString = '';  
  
  cadLog += new Date(Date.now()).toLocaleString('en-GB').replace(',','');
  cadTX = cadLog;
  switch (cadServ)
  {
   case '0': cadCompress = TextoComprimeDiccionario(cadToSend);  
    encodedString = btoa(cadCompress); //Base64  
    break;
   case '2': cadCompress = cadToSend;
    encodedString = LZString.compressToBase64(cadToSend); //LZW Base64
    break;
   default: cadCompress = TextoComprimeDiccionario(cadToSend);  
    encodedString = btoa(cadCompress); //Base64  
    break;
  }
           
  cadLen = cadToSend.length.toString().padStart(2, '0');
  let i=0;
  for (i=0;i<encodedString.length;i++)
  {	 
   cadDTMF += CharBase64To2DTMF(encodedString[i]);
  }  
  cadCRC = FrameGenerateCRC(cadDTMF);
  frameData += cadServ + cadLen + cadCRC;
    
  frameData += cadDTMF;
  for (i=0;i<frameData.length;i++){   
   gb_buf_send_dtmf += frameData[i];
  }  
  gb_buf_send_dtmf += '*';
  gb_buf_send_dtmf += gb_cadSilenceEnd + gb_cadNoiseEnd;

  cadTX+=' TX(1.' + cadServ + '):' + cadToSend;
  UpdateAreaRX(cadTX);
  
  cadLog += ' TX Type:1 Serv:' + cadServ + ' Len:'+ cadLen +' CRC:'+cadCRC;
  cadLog += ' '+cadToSend+' Len:'+cadToSend.length.toString();
  cadLog += ' Compress:'+cadCompress + ' Len:'+cadCompress.length.toString();
  cadLog += ' BASE64:'+encodedString+ ' Len:'+encodedString.length.toString();  
  cadLog += ' DTMF:' + cadDTMF+' Len:'+cadDTMF.length.toString();    
  cadLog += ' Frame:'+gb_buf_send_dtmf+' Len:'+gb_buf_send_dtmf.length.toString();
      
  DebugLog(cadLog);
 
  gb_total_dtmf_send = gb_buf_send_dtmf.length;
  gb_current_dtmf_send = 0;
  gb_play_dtmf= true;
  gb_begin_dtmf = false;
  gb_end_dtmf = false;
  gb_begin_silence = false;
  gb_end_silence = false; 
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 }
}


//function PruebaSendDTMF(){
// //gb_oscTone1.start();
// //gb_oscTone2.start();
// //let cadSend='0123456789ABCD*#' 
// //let cadSend=StringTo2KeyDTMF('Prueba');
// let cadSend=StringTo2KeyDTMF('Esto es una prueba'); 
// //alert(cadSend);
// let i=0;
// //gb_buf_send_dtmf[0]='#';
// gb_buf_send_dtmf = '#';
// for (i=1;i<=cadSend.length;i++){
//  //gb_buf_send_dtmf[i] = cadSend[(i-1)];
//  gb_buf_send_dtmf += cadSend[(i-1)];
// }
// //gb_buf_send_dtmf[(cadSend.length+1)]='#';
// gb_buf_send_dtmf += '#';
// //3B7D8A6C1A3B7D1A8B6B2A1A7A7C8B3B2B2A 
// gb_total_dtmf_send= cadSend.length+1;
// gb_current_dtmf_send = 0;
// gb_play_dtmf= true;
// gb_begin_dtmf = false;
// gb_end_dtmf = false;
// gb_begin_silence = false;
// gb_end_silence = false;
//}


function LoadBotones()
{
 try
 {  
  gb_id_stq = Number(gb_ctrl_input_stq.elt.value);
  gb_id_q4 = Number(gb_ctrl_input_q4.elt.value);
  gb_id_q3 = Number(gb_ctrl_input_q3.elt.value);
  gb_id_q2 = Number(gb_ctrl_input_q2.elt.value);
  gb_id_q1 = Number(gb_ctrl_input_q1.elt.value);
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

function NumberToDTMFString(valor){
 let aReturn='';
 try
 {
  switch (valor)
  {
   case 0: aReturn ='D'; break; //16
   case 1: aReturn ='1'; break;
   case 2: aReturn ='2'; break;
   case 3: aReturn ='3'; break;
   case 4: aReturn ='4'; break;
   case 5: aReturn ='5'; break;
   case 6: aReturn ='6'; break;
   case 7: aReturn ='7'; break;
   case 8: aReturn ='8'; break;
   case 9: aReturn ='9'; break;
   case 10: aReturn ='0'; break; //0
   case 11: aReturn ='*'; break;
   case 12: aReturn ='#'; break;
   case 13: aReturn ='A'; break;
   case 14: aReturn ='B'; break;
   case 15: aReturn ='C'; break;
   default: aReturn=''; break;
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return aReturn;
}


//Convierte de 2key dtmf a caracter
function TwoKeyDTMFTochar(valor)
{
 let aReturn='';
 try
 {
  switch(valor)
  {
   case '2A': aReturn= 'A';break;
   case '2B': aReturn= 'B';break;
   case '2C': aReturn= 'C';break;
   case '3A': aReturn= 'D';break;
   case '3B': aReturn= 'E';break;
   case '3C': aReturn= 'F';break;
   case '4A': aReturn= 'G';break;
   case '4B': aReturn= 'H';break;
   case '4C': aReturn= 'I';break;
   case '5A': aReturn= 'J';break;
   case '5B': aReturn= 'K';break;
   case '5C': aReturn= 'L';break;
   case '6A': aReturn= 'M';break;
   case '6B': aReturn= 'N';break;
   case '6C': aReturn= 'O';break;
   case '7A': aReturn= 'P';break;
   case '7B': aReturn= 'Q';break;
   case '7C': aReturn= 'R';break;
   case '7D': aReturn= 'S';break;
   case '8A': aReturn= 'T';break;
   case '8B': aReturn= 'U';break;
   case '8C': aReturn= 'V';break;  
   case '9A': aReturn= 'W';break;
   case '9B': aReturn= 'X';break;
   case '9C': aReturn= 'Y';break;
   case '9D': aReturn= 'Z';break;
   case '1A': aReturn= ' ';break;
   case '1B': aReturn= ',';break;
   case '1C': aReturn= '.';break;
   case '1D': aReturn= '?';break;
   default: aReturn = ''; break;
  } 
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return aReturn;
}

//Convierte un caracter a codigo 2-key dtmf
function CharTo2KeyDTMF(valor)
{
 let aReturn='';
 try
 {
  switch(valor)
  {
   case 'A': aReturn= '2A';break;
   case 'B': aReturn= '2B';break;
   case 'C': aReturn= '2C';break;
   case 'D': aReturn= '3A';break;
   case 'E': aReturn= '3B';break;
   case 'F': aReturn= '3C';break;
   case 'G': aReturn= '4A';break;
   case 'H': aReturn= '4B';break;
   case 'I': aReturn= '4C';break;
   case 'J': aReturn= '5A';break;
   case 'K': aReturn= '5B';break;
   case 'L': aReturn= '5C';break;
   case 'M': aReturn= '6A';break;
   case 'N': aReturn= '6B';break;
   case 'O': aReturn= '6C';break;
   case 'P': aReturn= '7A';break;
   case 'Q': aReturn= '7B';break;
   case 'R': aReturn= '7C';break;
   case 'S': aReturn= '7D';break;
   case 'T': aReturn= '8A';break;
   case 'U': aReturn= '8B';break;
   case 'V': aReturn= '8C';break;  
   case 'W': aReturn= '9A';break;
   case 'X': aReturn= '9B';break;
   case 'Y': aReturn= '9C';break;
   case 'Z': aReturn= '9D';break;
   case ' ': aReturn= '1A';break;
   case ',': aReturn= '1B';break;
   case '.': aReturn= '1C';break;
   case '?': aReturn= '1D';break;
   default: aReturn = ''; break;
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return (aReturn);
}

//Convierte string 2KeyDTMFTo String normal
function StringTwoKeyDTMFToString(cad)
{
 let aReturn=''; 
 let i=0;
 try
 {
  for (i=0;i<(cad.length-2);i+=2)
  {
   aReturn += TwoKeyDTMFTochar(cad[i]+cad[i+1]);
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return (aReturn);
}

//Convierte un string a 2-key dtmf
function StringTo2KeyDTMF(cad)
{
 let aReturn='';
 let i=0;
 try
 {
  for (i=0;i<cad.length;i++)
  {
   aReturn = aReturn+CharTo2KeyDTMF(cad[i].toUpperCase());
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return aReturn;
}


//Silencio de los 2 tonos DTMF
function StopSoundDTMF()
{
 try
 {
  gb_oscTone1.amp(0);
  gb_oscTone2.amp(0);
  gb_oscTone1.stop();
  gb_oscTone2.stop();
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Tarjeta de Sonido
function Poll_DTMFPlaySound()
{
 let valor='';
 let gb_aux_tx_time;
 try
 {	
  if (gb_play_dtmf === true)
  {  
   if (gb_begin_dtmf === false)
   {
    gb_ini_dtmf = millis();
    gb_begin_dtmf = true;
    gb_end_dtmf = false;
    gb_begin_silence = false;
    gb_end_silence = false;   
    gb_oscTone1.stop();
    gb_oscTone2.stop();
    let baja= 0;
    let alta= 0;  
    valor = gb_buf_send_dtmf[gb_current_dtmf_send];
	if (gb_current_dtmf_send === 0)
	{
	 gb_medir_tx_ini = Date. now(); //Mide tiempo TX inicio
	}
	else
	{
	  if (gb_current_dtmf_send === (gb_total_dtmf_send-1))
	  {
		gb_aux_tx_time = Date. now() - gb_medir_tx_ini; //Mide tiempo TX inicio		
		DebugLog ('Time TX:' + gb_aux_tx_time+' ms ' + (Math.round(gb_aux_tx_time/1000))+' s');
		gb_medir_tx_ini = gb_aux_tx_time;
		
	  }
	}
    switch (valor)
    {
     case '1': baja= 697; alta= 1209; break;
     case '2': baja= 697; alta= 1336; break;
     case '3': baja= 697; alta= 1477; break;
     case '4': baja= 770; alta= 1209; break;
     case '5': baja= 770; alta= 1336; break;
     case '6': baja= 770; alta= 1477; break;
     case '7': baja= 852; alta= 1209; break;
     case '8': baja= 852; alta= 1336; break;
     case '9': baja= 852; alta= 1477; break;
     case '*': baja= 941; alta= 1209; break;
     case '0': baja= 941; alta= 1336; break;
     case '#': baja= 941; alta= 1477; break;
     case 'A': baja= 697; alta= 1633; break;
     case 'B': baja= 770; alta= 1633; break;
     case 'C': baja= 852; alta= 1633; break;
     case 'D': baja= 941; alta= 1633; break;
	 default: baja= 0; alta= 0; break; //silencio
    }   
    gb_oscTone1.freq(baja);
    gb_oscTone2.freq(alta);
    gb_oscTone1.amp(1);
    gb_oscTone2.amp(1);
    gb_oscTone1.start();
    gb_oscTone2.start();
	gb_forceDraw = true; //fuerza dibujar actualiza TX
   }
   else
   {//Esta sonando
    if (gb_begin_silence === true)
    { //La parte del silencio
	 if ((millis() - gb_ini_dtmf) >= gb_time_silence)
	 {
 	  //if ((millis()-gb_ini_dtmf)>=250){//MT8870 tiempo silencio 250, 500 ms para microfono
 	  gb_begin_dtmf = false;
      gb_end_dtmf = false;
      gb_begin_silence = false;
      gb_end_silence = false;	 
	  gb_current_dtmf_send++;
	  gb_forceDraw = true; //fuerza dibujar actualiza TX
	  if (gb_current_dtmf_send >= gb_total_dtmf_send)
	  {
	   gb_current_dtmf_send= 0;
       StopSoundDTMF();
	   gb_play_dtmf = false;	   
	  }
	 }
    }
    else
    {
     if ((millis() - gb_ini_dtmf) >= gb_time_sound)
	 {
	  //if ((millis()-gb_ini_dtmf)>=150){//MT8870 tiempo sonido 150 ms, 300 ms para microfono
	  StopSoundDTMF();
	  gb_begin_dtmf = true;
      gb_end_dtmf = true;
      gb_begin_silence = true;
      gb_end_silence = false;
	  gb_forceDraw = true;
     }
    }
   }
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Convierte fila columna a DTMF
function RowColToDtmf(row,col)
{
 try
 { 
  if ((row === 0) && (col === 0)){return ('1');}
  if ((row === 0) && (col === 1)){return ('2');}
  if ((row === 0) && (col === 2)){return ('3');}
  if ((row === 0) && (col === 3)){return ('A');}
  if ((row === 1) && (col === 0)){return ('4');}
  if ((row === 1) && (col === 1)){return ('5');}
  if ((row === 1) && (col === 2)){return ('6');}
  if ((row === 1) && (col === 3)){return ('B');}
  if ((row === 2) && (col === 0)){return ('7');}
  if ((row === 2) && (col === 1)){return ('8');}
  if ((row === 2) && (col === 2)){return ('9');}
  if ((row === 2) && (col === 3)){return ('C');}
  if ((row === 3) && (col === 0)){return ('*');}
  if ((row === 3) && (col === 1)){return ('0');}
  if ((row === 3) && (col === 2)){return ('#');}
  if ((row === 3) && (col === 3)){return ('D');}
  return (''); //No devuelve nada
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return ('');
}

//Analiza las frecuencias desde Tarjeta Sonido
function Poll_FFT_DTMF()
{
 //44100 / 1024 = 43,06 Hz saltos  21,533203125 Hz
 try
 {
  if (gb_use_mic_dtmf === true)
  { 
   if ((typeof gb_mic === 'undefined') || (typeof gb_fft === 'undefined'))
   {
	return;
   }
	   
   let spectrum = gb_fft.analyze();
   let row= -1;
   let col= -1;  
  
   if (spectrum[31] > 250){row = 0;}
   else{
    if (spectrum[35] > 250){row = 1;}
    else{
     if (spectrum[39] > 250){row = 2;}
     else{
      if (spectrum[43] > 250){row = 3;}
	 }
    }
   }
 
   if (spectrum[55] > 250){col = 0;}
   else{
    if (spectrum[61] > 250){col = 1;}
    else{
     if (spectrum[67] > 250){col = 2;}
     else{
      if (spectrum[76] > 250){col = 3;}
	 }
    }
   }
  		
   if ((row>-1) && (col>-1))
   {
    gb_fft_dtmf = RowColToDtmf(row,col);
    gb_cadDTMF = gb_fft_dtmf;
    if (gb_fft_dtmf_antes != gb_fft_dtmf)
	{	
     gb_fft_dtmf_antes = gb_fft_dtmf;
     gb_cad_areaRX += gb_fft_dtmf;	
	 gb_buf_rcv_dtmf += gb_fft_dtmf;
	 gb_event_new_data_dtmf = true;
	 if (gb_fft_dtmf === '#')
	 {
	  gb_begin_sync_dtmf= true;
     }
	 switch (gb_fft_dtmf)
	 {
	   case '#': gb_begin_sms = true; gb_end_sms = false; break;
	   case '*': gb_end_sms = true; gb_begin_sms = false; break;	  
	 }
	 if (gb_fft_dtmf === '*')
	 {
	 
	 }
     gb_forceDraw = true;
    }
   }
   else
   {
    gb_fft_dtmf= gb_fft_dtmf_antes= '';
   }
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}






//Lee tonos DTMF desde el gamepad conectado a MT8870
function Poll_Pad_DTMF()
{
 try
 {
  if (gb_use_gamepad_dtmf === true)
  {
   let pads = navigator.getGamepads();
   let pad0 = pads[0];
   let i=0;
   if (pad0)
   {
    gb_cad_botones='';
    for (i=0;i<pad0.buttons.length;i++)
    {
     if (pad0.buttons[i].value === 1)
     {
      gb_cad_botones+='1';
     }
     else
     {
      gb_cad_botones+='0';
     }
     switch ((i+1))
     {
   	  case gb_id_stq: value_stq = pad0.buttons[i].value; break;
 	  case gb_id_q4: value_q4 = pad0.buttons[i].value; break;
 	  case gb_id_q3: value_q3 = pad0.buttons[i].value; break;
	  case gb_id_q2: value_q2 = pad0.buttons[i].value; break;
	  case gb_id_q1: value_q1 = pad0.buttons[i].value; break;
	  default: break;
     }
    }
   }
   gb_cad_bit_dtmf = '';
   gb_cad_bit_dtmf += value_stq;
   gb_cad_bit_dtmf += value_q4;
   gb_cad_bit_dtmf += value_q3;
   gb_cad_bit_dtmf += value_q2;
   gb_cad_bit_dtmf += value_q1;
 
   if (value_stq === 1)
   {
    if (stq_antes === 0)
    {
     gb_dato = (value_q4*8)+(value_q3*4)+(value_q2*2)+value_q1;
     gb_cadDTMF = NumberToDTMFString(gb_dato);
     gb_forceDraw = true;
    }
   }
   else
   {
    //gb_dato=0;
    //gb_cadDTMF = NumberToDTMFString(gb_dato);      
   }
 
   if ((value_q4 != value_q4_antes)
       ||
       (value_q3 != value_q3_antes)
       ||
       (value_q2 != value_q2_antes)
       ||
       (value_q1 != value_q1_antes)
       ||
       (value_stq != value_stq_antes)
      )
   {
    gb_forceDraw = true;
   }
 
   if (value_stq != stq_antes)
   {
    if ((stq_antes === 0) && (value_stq === 1))
    {
     gb_cad_areaRX += gb_cadDTMF;
   
     gb_buf_rcv_dtmf += gb_cadDTMF;
     gb_event_new_data_dtmf = true;
     if (gb_cadDTMF === '#')
     {
      gb_begin_sync_dtmf= true;
     }
	 
	 switch (gb_cadDTMF)
	 {
	   case '#': gb_begin_sms = true; gb_end_sms = false; break;
	   case '*': gb_end_sms = true; gb_begin_sms = false; break;	  
	 }	 
	
     gb_forceDraw = true;
    }	 
    stq_antes = value_stq;
   }	
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Dibuja los datos principales en Pantalla del gamepad
function PollDibujaDatos()
{
 let cadTX='';
 try
 {
  if (gb_forceDraw === true)
  {
   gb_forceDraw = false;
   background(255);
   //fill(0, 0, 0);
   if (gb_use_gamepad_dtmf === true)
   {
    text(gb_cad_botones, 200, 30); 
    text(gb_cad_bit_dtmf, 200, 60);
    text('stq: '+value_stq, 200, 80);
    text('q4: '+value_q4, 200, 100);
    text('q3: '+value_q3, 200, 120);
    text('q2: '+value_q2, 200, 140);
    text('q1: '+value_q1, 200, 160);
	
	text('PAD:' + gb_cad_botones, 520, 440);
	text('BIT:' + gb_cad_bit_dtmf, 520, 460);
    
    //text('stq', 200, 200);
    //text('q4', 200, 230);
    //text('q3', 200, 270);
    //text('q2', 200, 300);
    //text('q1', 200, 330);   
   }
   text('gb_dato: '+gb_dato, 580, 370);
   text('DTMF: '+gb_cadDTMF,580,390);
   if (gb_cad_areaRX.length > 30)
   {
    gb_cad_areaRX ='';
   }
   text(gb_cad_areaRX,10,380);
   //gb_ctrl_areaRX.elt.value = gb_cad_areaRX;    
  
   //Se esta enviando datos  
   if (gb_play_dtmf === true)
   {	  
    cadTX = 'TX:' + (gb_current_dtmf_send+1).toString() + '/' + gb_total_dtmf_send.toString();
    cadTX +='(' + gb_buf_send_dtmf[gb_current_dtmf_send] + ')';
    text(cadTX, 560, 420);
   }
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Detecta Tipo de datagrama -1 si no tiene tipo
function DetectFrameData()
{
 let aReturn = -1;
 try
 {
  if (gb_end_sms === true)
  {
   gb_end_sms = false;
   aReturn = Number(gb_buf_rcv_dtmf[0]);
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
 return aReturn;
}

//Procesa un SMS Tipo 0 con longitud y CRC
function ProcesSMSTipo0()
{
 //#0xxYYzz..*
 let auxLen= 0;
 let auxCRC= 0;
 let cadLog='';
 let i=0;
 let cont=0;
 let cadBase64='';
 let cadRX='';
 let cadAreaRX ='';
 let cadDTMF ='';
 
 try
 {
  auxLen = gb_buf_rcv_dtmf.length-2; //Quitamos * y Type 0  
  cadLog += new Date(Date.now()).toLocaleString('en-GB').replace(',','');
  cadAreaRX = cadLog;
  cadLog += ' RX Type:0';
  cadLog += ' Len:'+auxLen;
  auxLen = (Math.trunc(auxLen/2));
  cont= 1; //Comienza despues servicio
  for (i=0;i<auxLen;i++)
  {
   cadDTMF += gb_buf_rcv_dtmf[cont] + gb_buf_rcv_dtmf[cont+1];
   cadBase64 += DTMFtoCharBase64(gb_buf_rcv_dtmf[cont] + gb_buf_rcv_dtmf[cont+1]);
   cont += 2;
  }
  cadLog += ' DTMF:' + cadDTMF;
  cadLog += ' BASE64:' + cadBase64+ ' Len:' + auxLen.toString();
  cadRX = atob(cadBase64); //Base64 decode
  cadLog += ' RX:' + cadRX + ' Len:' + cadRX.length.toString();
  cadLog += ' Frame:#' + gb_buf_rcv_dtmf + ' Len:' + (gb_buf_rcv_dtmf.length + 1).toString(); //Aniadido #
   
  DebugLog(cadLog);
  cadAreaRX += ' RX(0):'+cadRX;
  UpdateAreaRX(cadAreaRX);
  gb_buf_rcv_dtmf = '';
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Procesa un SMS Tipo 1 con longitud y CRC
function ProcesSMSTipo1()
{
 let auxLen= 0; //longiud trama
 let auxCadLen=0; //longitud cadena
 let auxCRC= 0;
 let cadServ= 0;
 let cadLog='';
 let i=0;
 let cont=0;
 let cadBase64='';
 let cadDTMF ='';
 let cadDecompress='';
 let cadAreaRX ='';
 try
 {
  auxLen = gb_buf_rcv_dtmf.length-7; //Quitamos *(1),Type 0(1),Serv(1),Len(2),CRC(2)
  auxLen = (Math.trunc(auxLen/2));
  cadServ = gb_buf_rcv_dtmf[1]; //Servicio
  auxCadLen = parseInt(gb_buf_rcv_dtmf[2]+gb_buf_rcv_dtmf[3]); //Longitud 2 caracteres
  auxCRC = parseInt(gb_buf_rcv_dtmf[4]+gb_buf_rcv_dtmf[5]); //CRC  
  //alert (auxLen);   
  cadLog += new Date(Date.now()).toLocaleString('en-GB').replace(',','');
  cadAreaRX = cadLog;
  
  cadLog += 'RX Type:1';
  cadLog += ' Srv:'+cadServ; //Servicio
  cadLog += ' Len:'+auxCadLen.toString(); //Longitud
  cadLog += ' CRC:'+auxCRC.toString(); //CRC
  cont= 6; //Comienza despues de CRC
  for (i=0; i<auxLen; i++)
  {
   cadDTMF += gb_buf_rcv_dtmf[cont] + gb_buf_rcv_dtmf[cont+1];
   cadBase64 += DTMFtoCharBase64(gb_buf_rcv_dtmf[cont] + gb_buf_rcv_dtmf[cont+1]);
   cont += 2;
  }
    
  cadLog += ' DTMF:'+cadDTMF;
  cadLog += ' BASE64:'+cadBase64+ ' Len:'+auxLen.toString();

  switch (cadServ)
  {
   case '0': cadRX = atob(cadBase64); //Base64 decode   
    cadDecompress = TextoDescomprimeDiccionario(cadRX);
    break;
   case '2': cadRX = LZString.decompressFromBase64 (cadBase64);
    cadDecompress = cadRX;
    break;
   default: cadRX = atob(cadBase64); //Base64 decode
    break;   
  }  
  
  cadLog += ' RX:' + cadRX + ' Len:' + cadRX.length.toString();  
  cadLog += ' Decompress:' + cadDecompress + ' Len:'+cadDecompress.length.toString();
  cadLog += ' Frame:#' + gb_buf_rcv_dtmf + ' Len:' + (gb_buf_rcv_dtmf.length + 1).toString(); //Aniadido #
  
  DebugLog(cadLog);
  
  cadAreaRX += ' RX(1.' + cadServ + '):' + cadDecompress;
  UpdateAreaRX(cadAreaRX);
  gb_buf_rcv_dtmf = '';
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Procesa los buffers de datos DTMF recibidos y eventos
function PollProcessDTMF()
{
 try
 {
  if (gb_begin_sync_dtmf === true)
  {
   gb_begin_sync_dtmf= false; //Comienzo trama
   //gb_cadDTMF +=' Sync';
  
   //let aux_cad = gb_buf_rcv_dtmf;  
   //console.log(aux_cad);
   //gb_cadDTMF+=' '+StringTwoKeyDTMFToString(aux_cad);
  
   gb_buf_rcv_dtmf =''; //reset buffer recepcion
   gb_forceDraw = true;
  }
 
  if (gb_event_new_data_dtmf === true)
  {
   switch (DetectFrameData())
   {	  
    case 0: ProcesSMSTipo0(); break;
    case 1: ProcesSMSTipo1(); break;   
    case -1: break;
   }  
	 
   gb_event_new_data_dtmf= false;//Nuevo gb_dato
   //gb_cadDTMF +=' Data';
  
   //let aux_cad = gb_buf_rcv_dtmf;  
   //gb_cadDTMF+=' '+StringTwoKeyDTMFToString(aux_cad);
  
   gb_forceDraw = true;
  }
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Selecciona tab config gamepad
function SelectTabPAD()
{
 try
 {
  gb_ctrl_btnTabPAD.elt.disabled = true;
  gb_ctrl_btnTabRX.elt.disabled = false;
	
  gb_ctrl_areaRX.hide();
  gb_ctrl_areaTX.hide();
 
  gb_ctrl_lbl_stq.show(); //labels pad Show
  gb_ctrl_lbl_q4.show();
  gb_ctrl_lbl_q3.show();
  gb_ctrl_lbl_q2.show();
  gb_ctrl_lbl_q1.show();
  gb_ctrl_input_stq.show(); //Inputs pads Show
  gb_ctrl_input_q4.show();
  gb_ctrl_input_q3.show();
  gb_ctrl_input_q2.show();
  gb_ctrl_input_q1.show();

  //gb_ctrl_btnPruebaSendSMS0.hide();
  gb_ctrl_btnPruebaSendTX0.hide();
  //gb_ctrl_btnPruebaSendDTMF.hide();
  //gb_ctrl_btnPruebaSendSMS1.hide();
  gb_ctrl_cmbSMS.hide();
    
  gb_ctrl_chkboxPAD.show();
  gb_ctrl_chkboxMic.show();
  
  gb_ctrl_lbl_ptt.show();
  gb_ctrl_input_ptt.show();
  gb_ctrl_chkbox_fullduplex.show();
  gb_ctrl_chkbox_log.show();
  gb_ctrl_lbl_speed_dtmf.show();
  gb_ctrl_input_speed_dtmf.show();  
  
  gb_ctrl_chkboxRelay.show();
  
  gb_ctrl_btnClear.hide();
  
 gb_ctrl_lbl_silenceStart.show();
 gb_ctrl_input_silenceStart.show();
 gb_ctrl_lbl_silenceEnd.show();
 gb_ctrl_input_silenceEnd.show();
 gb_ctrl_lbl_NoiseEnd.show();
 gb_ctrl_input_NoiseEnd.show();
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Selecciona tab RX
function SelectTabRX()
{
 try
 {
  gb_ctrl_btnTabPAD.elt.disabled = false;
  gb_ctrl_btnTabRX.elt.disabled = true;
 
  gb_ctrl_areaRX.show();
  gb_ctrl_areaTX.show();

  gb_ctrl_lbl_stq.hide(); //labels pad hide
  gb_ctrl_lbl_q4.hide();
  gb_ctrl_lbl_q3.hide();
  gb_ctrl_lbl_q2.hide();
  gb_ctrl_lbl_q1.hide();
  gb_ctrl_input_stq.hide(); //inputs pad hide
  gb_ctrl_input_q4.hide();
  gb_ctrl_input_q3.hide();
  gb_ctrl_input_q2.hide();
  gb_ctrl_input_q1.hide();
 
  //gb_ctrl_btnPruebaSendSMS0.show();
  gb_ctrl_btnPruebaSendTX0.show();
  //gb_ctrl_btnPruebaSendDTMF.show();
  //gb_ctrl_btnPruebaSendSMS1.show();
  gb_ctrl_cmbSMS.show();
  
  gb_ctrl_chkboxPAD.hide();
  gb_ctrl_chkboxMic.hide();
  
  gb_ctrl_lbl_ptt.hide();
  gb_ctrl_input_ptt.hide();
  gb_ctrl_chkbox_fullduplex.hide();
  gb_ctrl_chkbox_log.hide();  
  gb_ctrl_lbl_speed_dtmf.hide();
  gb_ctrl_input_speed_dtmf.hide();
  
  gb_ctrl_chkboxRelay.hide();
  
  gb_ctrl_btnClear.show();
  
  gb_ctrl_lbl_silenceStart.hide();
  gb_ctrl_input_silenceStart.hide();
  gb_ctrl_lbl_silenceEnd.hide();
  gb_ctrl_input_silenceEnd.hide();
  gb_ctrl_lbl_NoiseEnd.hide();
  gb_ctrl_input_NoiseEnd.hide();
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}

//Rutina principal Draw Poll
function draw()
{
 try
 {
  Poll_DTMFPlaySound(); //Reproduce tonos DTMF
  //Poll Gamepad
  if (gb_use_gamepad_dtmf === true)
  {
   if (gb_play_dtmf === true)
   {
    if (gb_fullduplex === true)
    {
	 Poll_Pad_DTMF(); //Lee del gamepad tonos DTMF
    }	   
   }
   else
   {
    Poll_Pad_DTMF(); //Lee del gamepad tonos DTMF
   }
  }
  
  //Poll Mic
  if (gb_use_mic_dtmf === true)
  {
   if (gb_play_dtmf === true)
   {
    if (gb_fullduplex === true)
    {
	 Poll_FFT_DTMF(); //Lee tonos DTMF de microfono  
	}		
   }
   else
   {
    Poll_FFT_DTMF(); //Lee tonos DTMF de microfono  
   }
  }
  
  PollProcessDTMF();
  PollDibujaDatos();
 }
 catch(err)
 {
  DebugLog(err.message.toString());
 } 
}