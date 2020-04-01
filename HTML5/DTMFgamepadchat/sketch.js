//Autor: Jaime Jose Gavin Sierra
//EA1HLX
//Ackerman
//Chat over dtmf.
// Received gamepad MT8870 and Sound Card mic or line in
// Send: Sound Card
// # - Comienzo sms
//   - 
// * - Fin sms 

var id_stq,id_q4,id_q3,id_q2,id_q1;
var value_stq,value_q4,value_q3,value_q2,value_q1;
var value_stq_antes,value_q4_antes,value_q3_antes,value_q2_antes,value_q1_antes;

var gb_cad_bit_dtmf='';
var stq_antes=0;
var dato=0;
var gb_cadDTMF='';

var areaRX;
var gb_forceDraw = false;
var cad_areaRX = '';

var input_stq;
var input_q4;
var input_q3;
var input_q2;
var input_q1;
var btnBotones;
var btnClear;
var gb_cad_botones='';

var gb_oscTone1;
var gb_oscTone2;
var gb_current_array_dtmf_send = 0;
var gb_total_array_dtmf_send = 0;
var gb_buf_send_dtmf = '';
var gb_play_array_dtmf= false;
var gb_begin_dtmf = false;
var gb_end_dtmf = false;
var gb_begin_silence = false;
var gb_end_silence = false;
var gb_ini_dtmf;

var gb_mic, gb_fft;
var gb_fft_dtmf='';
var gb_fft_dtmf_antes='';
var gb_ini_fft_dtmf = false;
var gb_ini_fft_dtmf_time;

var gb_use_gamepad_dtmf= false;
var gb_use_mic_dtmf= true;

var gb_buf_rcv_dtmf = '' //string buffer recepcion 
var gb_event_new_data_dtmf= false;
var gb_begin_sync_dtmf= false;

var gb_begin_sms= false; //sms
var gb_end_sms= false;



//Rutina principal Setup inicial
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Courier');
  textSize(20);

  areaRX = createElement('textarea');
  areaRX.position(20,10);
  areaRX.style('width','800px');
  areaRX.style('height','160px');
  areaRX.elt.placeholder='';
     
  value_stq= value_q4= value_q3= value_q2 = value_q1 = 0;
  //value_stq_antes = value_q4_antes = value_q3_antes = value_q2_antes = value_q1_antes = 0;  
  
  id_stq = 3;
  id_q4 = 5;
  id_q3 = 6;
  id_q2 = 9;
  id_q1 = 10;
 

  btnBotones = createButton('Botones');
  btnBotones.position(220,190);
  btnBotones.mousePressed(LoadBotones);
  
  btnClear = createButton('Clear');
  btnClear.position(220, 220);
  btnClear.mousePressed(ClearDtmf);
   
  btnStop = createButton('Stop');
  btnStop.position(220, 250);
  btnStop.mousePressed(StopSound);
    
  btnPruebaSendDTMF = createButton('Send');
  btnPruebaSendDTMF.position(220, 290);
  btnPruebaSendDTMF.mousePressed(PruebaSendDTMF);
  
  btnPruebaSendDTMF = createButton('SendSMS0');
  btnPruebaSendDTMF.position(320, 290);
  btnPruebaSendDTMF.mousePressed(function(){SendSMSTipo0('HOLA')});
    
  areaTX = createElement('textarea');
  areaTX.position(620,190);
  areaTX.style('width','200px');
  areaTX.style('height','70px');
  areaTX.elt.placeholder='';
  
  btnPruebaSendDTMF = createButton('TX0');
  btnPruebaSendDTMF.position(620, 290);
  btnPruebaSendDTMF.mousePressed(PruebaSendTXSMSTipo0);	
  
  btnPruebaSendDTMF = createButton('SendSMS1');
  btnPruebaSendDTMF.position(420, 290);
  btnPruebaSendDTMF.mousePressed(PruebaSendSMSTipo1);
  

  input_stq = createInput();
  input_stq.position(60, 190);
  input_stq.elt.value = id_stq.toString();

  input_q4 = createInput();
  input_q4.position(60, 220);
  input_q4.elt.value = id_q4.toString();

  input_q3 = createInput();
  input_q3.position(60, 250);
  input_q3.elt.value = id_q3.toString();
  
  input_q2 = createInput();
  input_q2.position(60, 280);
  input_q2.elt.value = id_q2.toString();
  
  input_q1 = createInput();
  input_q1.position(60, 310);
  input_q1.elt.value = id_q1.toString();
      
	  
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
	  

  //Preparar la captura de microfono	  
  if (gb_use_mic_dtmf === true){
   gb_mic = new p5.AudioIn();
   gb_mic.start();
   gb_fft = new p5.FFT();
   gb_fft.setInput(gb_mic);  
  }
  
	  
  gb_forceDraw = true;  
}

//Reproduce un tono DTMF dado
function PlayDTMF(data)
{   
  //gb_buf_send_dtmf[0] = data;
  gb_buf_send_dtmf = data;
  gb_total_array_dtmf_send= 0;
  gb_current_array_dtmf_send = 0;
  gb_play_array_dtmf= true;
  gb_begin_dtmf = false;
  gb_end_dtmf = false;
  gb_begin_silence = false;
  gb_end_silence = false;
}


function StopSound(){
 gb_oscTone1.stop();
 gb_oscTone2.stop();
 gb_play_array_dtmf = false;
}

function ClearDtmf(){
 cad_areaRX='';
 gb_forceDraw = true;
 
 alert(StringTo2KeyDTMF('esto es una prueba'));
}

//Convierte caracter Base64 A..Z a codigo decimal 0..63
function CharBase64To2DTMF(car)
{
 let aReturn = '';
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
 return aReturn;
}

//Convierte de 2 DTMF a Base64
function DTMFtoCharBase64(dtmf)
{
 let aReturn = '';
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
 return aReturn;
}

//Envia un mensaje del TextMemo
function PruebaSendTXSMSTipo0()
{
 let cadToSend = areaTX.elt.value;
 SendSMSTipo0(cadToSend);
}

//Actualiza la area de recepcion que tambien pone TX
function UpdateAreaRX(cad)
{
 areaRX.elt.value += cad+'\n';
}

//Send SMS de Prueba basica tipo 0 sin longitud ni CRC
function SendSMSTipo0(cadToSend)
{
 //#0323334*
 //gb_buf_send_dtmf[0]='#'; 
 gb_buf_send_dtmf = '#';
 let cadLog = '';
 let frameData = '0'; //Servicio 0
 let cadTX = '';
 //let cadSend = '323334'; 
 //let cadToSend = 'HOLA';
 
 let encodedString = btoa(cadToSend); //Base64  
 cadLog += new Date(Date.now()).toLocaleString('en-GB').replace(',','');
 cadTX = cadLog;
 cadLog += ' TX '+cadToSend+' BASE64:'+encodedString;
 let cadDTMF = '';
 let i=0;
 for (i=0;i<encodedString.length;i++)
 {	 
  cadDTMF += CharBase64To2DTMF(encodedString[i]);
 }
 cadLog += ' DTMF:' + cadDTMF;
 console.log(cadLog); 
 
 cadTX+=' TX:'+cadToSend;
 UpdateAreaRX(cadTX);
 
 frameData += cadDTMF;
 for (i=1;i<=frameData.length;i++){
  //gb_buf_send_dtmf[i] = frameData[(i-1)];
  gb_buf_send_dtmf += frameData[(i-1)];
 }
 //gb_buf_send_dtmf[(frameData.length+1)]='*';
 gb_buf_send_dtmf += '*';
 

 
 gb_total_array_dtmf_send= frameData.length+1;
 gb_current_array_dtmf_send = 0;
 gb_play_array_dtmf= true;
 gb_begin_dtmf = false;
 gb_end_dtmf = false;
 gb_begin_silence = false;
 gb_end_silence = false; 
}

//Send SMS de Prueba basica tipo 1 cin longitud y CRC
function PruebaSendSMSTipo1()
{
 //gb_buf_send_dtmf[0]='#'; 
 gb_buf_send_dtmf = '#';
 let cadSend = '0'; //Servicio 0
 cadSend += '16';   //Longitud cadena
 cadSend += '00';   //CRC
 cadSend += '323334';
 let i=0;
 for (i=1;i<=cadSend.length;i++){
  //gb_buf_send_dtmf[i] = cadSend[(i-1)];
  gb_buf_send_dtmf += cadSend[(i-1)];
 }
 //gb_buf_send_dtmf[(cadSend.length+1)]='*'; 
 gb_buf_send_dtmf += '*'; 
 
 gb_total_array_dtmf_send= cadSend.length+1;
 gb_current_array_dtmf_send = 0;
 gb_play_array_dtmf= true;
 gb_begin_dtmf = false;
 gb_end_dtmf = false;
 gb_begin_silence = false;
 gb_end_silence = false; 
}

function PruebaSendDTMF(){
 //gb_oscTone1.start();
 //gb_oscTone2.start();
 //let cadSend='0123456789ABCD*#' 
 //let cadSend=StringTo2KeyDTMF('Prueba');
 let cadSend=StringTo2KeyDTMF('Esto es una prueba'); 
 //alert(cadSend);
 let i=0;
 //gb_buf_send_dtmf[0]='#';
 gb_buf_send_dtmf = '#';
 for (i=1;i<=cadSend.length;i++){
  //gb_buf_send_dtmf[i] = cadSend[(i-1)];
  gb_buf_send_dtmf += cadSend[(i-1)];
 }
 //gb_buf_send_dtmf[(cadSend.length+1)]='#';
 gb_buf_send_dtmf += '#';
 
 //alert(gb_array_dtmf);
 //gb_array_dtmf[0]='3';
 //gb_array_dtmf[1]='B';
 //gb_array_dtmf[2]='7';
 //gb_array_dtmf[3]='D';
 //gb_array_dtmf[4]='8';
 //gb_array_dtmf[5]='A';
 //gb_array_dtmf[6]='6';
 
 //3B7D8A6C1A3B7D1A8B6B2A1A7A7C8B3B2B2A
 
 gb_total_array_dtmf_send= cadSend.length+1;
 gb_current_array_dtmf_send = 0;
 gb_play_array_dtmf= true;
 gb_begin_dtmf = false;
 gb_end_dtmf = false;
 gb_begin_silence = false;
 gb_end_silence = false;
}


function LoadBotones(){ 
 id_stq = Number(input_stq.elt.value);
 id_q4 = Number(input_q4.elt.value);
 id_q3 = Number(input_q3.elt.value);
 id_q2 = Number(input_q2.elt.value);
 id_q1 = Number(input_q1.elt.value);
}

function NumberToDTMFString(valor){
 let aReturn='';
 switch (valor){
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
 return aReturn;
}


//Convierte de 2key dtmf a caracter
function TwoKeyDTMFTochar(valor){
 let aReturn='';
 switch(valor){
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
 }
 return aReturn;
}

//Convierte un caracter a codigo 2-key dtmf
function CharTo2KeyDTMF(valor){
 let aReturn='';
 switch(valor){
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
 }
 return (aReturn);
}

//Convierte string 2KeyDTMFTo String normal
function StringTwoKeyDTMFToString(cad){
 let aReturn='';
 let i=0;
 for (i=0;i<(cad.length-2);i+=2){
  aReturn += TwoKeyDTMFTochar(cad[i]+cad[i+1]);
 }
 return (aReturn);
}

//Convierte un string a 2-key dtmf
function StringTo2KeyDTMF(cad){
 let aReturn='';
 let i=0;
 for (i=0;i<cad.length;i++){
  aReturn = aReturn+CharTo2KeyDTMF(cad[i].toUpperCase());
 }
 return aReturn;
}


//Silencio de los 2 tonos DTMF
function StopSoundDTMF(){
 gb_oscTone1.amp(0);
 gb_oscTone2.amp(0);
 gb_oscTone1.stop();
 gb_oscTone2.stop();
}

function Poll_DTMFSound(){
 let valor='';
 if (gb_play_array_dtmf === true){  
  if (gb_begin_dtmf === false){
   gb_ini_dtmf = millis();
   gb_begin_dtmf = true;
   gb_end_dtmf = false;
   gb_begin_silence = false;
   gb_end_silence = false;   
   gb_oscTone1.stop();
   gb_oscTone2.stop();
   let baja= 0;
   let alta= 0;  
   valor = gb_buf_send_dtmf[gb_current_array_dtmf_send];  
   switch (valor){
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
   }   
   gb_oscTone1.freq(baja);
   gb_oscTone2.freq(alta);
   gb_oscTone1.amp(1);
   gb_oscTone2.amp(1);
   gb_oscTone1.start();
   gb_oscTone2.start();   
  }
  else{//Esta sonando
   if (gb_begin_silence === true){ //La parte del silencio
	if ((millis() - gb_ini_dtmf) >= 500){
	//if ((millis()-gb_ini_dtmf)>=250){//MT8870 tiempo silencio 250, 500 ms para microfono
	 gb_begin_dtmf = false;
     gb_end_dtmf = false;
     gb_begin_silence = false;
     gb_end_silence = false;
	 gb_current_array_dtmf_send++;
	 if (gb_current_array_dtmf_send > gb_total_array_dtmf_send){
	  gb_current_array_dtmf_send= 0;
      StopSoundDTMF();
	  gb_play_array_dtmf = false;
	 }
	}
   }
   else{
    if ((millis() - gb_ini_dtmf) >= 300){
	//if ((millis()-gb_ini_dtmf)>=150){//MT8870 tiempo sonido 150 ms, 300 ms para microfono
	 StopSoundDTMF();
	 gb_begin_dtmf = true;
     gb_end_dtmf = true;
     gb_begin_silence = true;
     gb_end_silence = false;
    }
   }

  }
 }
}

//Convierte fila columna a DTMF
function RowColToDtmf(row,col){ 
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
 return ('');
}

//Analiza las frecuencias desde Tarjeta Sonido
function Poll_FFT_DTMF(){
  //44100 / 1024 = 43,06 Hz saltos  21,533203125 Hz
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
  		
  if ((row>-1) && (col>-1)){   
   gb_fft_dtmf = RowColToDtmf(row,col);
   gb_cadDTMF = gb_fft_dtmf;
   if (gb_fft_dtmf_antes != gb_fft_dtmf){	
    gb_fft_dtmf_antes = gb_fft_dtmf;
    cad_areaRX += gb_fft_dtmf;	
	gb_buf_rcv_dtmf += gb_fft_dtmf;
	gb_event_new_data_dtmf = true;
	if (gb_fft_dtmf === '#'){
	 gb_begin_sync_dtmf= true;
    }
	switch (gb_fft_dtmf)
	{
	  case '#': gb_begin_sms = true; gb_end_sms = false; break;
	  case '*': gb_end_sms = true; gb_begin_sms = false; break;	  
	}
	if (gb_fft_dtmf === '*'){
	 
	}
    gb_forceDraw = true;
   }
  }
  else{
   gb_fft_dtmf= gb_fft_dtmf_antes= '';
  }  
}






//Lee tonos DTMF desde el gamepad conectado a MT8870
function Poll_Pad_DTMF(){ 
 let pads = navigator.getGamepads();
 let pad0 = pads[0];
 let i=0;
 if (pad0){
  gb_cad_botones='';
  for (i=0;i<pad0.buttons.length;i++){
   if (pad0.buttons[i].value === 1){
    gb_cad_botones+='1';
   }
   else{
    gb_cad_botones+='0';
   }
   switch ((i+1)){
	case id_stq: value_stq = pad0.buttons[i].value; break;
	case id_q4: value_q4 = pad0.buttons[i].value; break;
	case id_q3: value_q3 = pad0.buttons[i].value; break;
	case id_q2: value_q2 = pad0.buttons[i].value; break;
	case id_q1: value_q1 = pad0.buttons[i].value; break;
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
 
 if (value_stq === 1){
  if (stq_antes === 0){
   dato = (value_q4*8)+(value_q3*4)+(value_q2*2)+value_q1;
   gb_cadDTMF = NumberToDTMFString(dato);
   gb_forceDraw = true;
  }
 }
 else
 {
   //dato=0;
   //gb_cadDTMF = NumberToDTMFString(dato);      
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
    ){
  gb_forceDraw = true;
 }
 
 if (value_stq != stq_antes){
  if ((stq_antes === 0) && (value_stq === 1)){   
   cad_areaRX += gb_cadDTMF;
   
   gb_buf_rcv_dtmf += gb_cadDTMF;
   gb_event_new_data_dtmf = true;
   if (gb_cadDTMF === '#'){
    gb_begin_sync_dtmf= true;
   }
	
   gb_forceDraw = true;
  }	 
  stq_antes = value_stq;
 }	
}

//Dibuja los datos principales en Pantalla
function PollDibujaDatos()
{
 if (gb_forceDraw === true)
 {
  gb_forceDraw = false;
  background(255);
  //fill(0, 0, 0);
  if (gb_use_gamepad_dtmf === true)
  {
   text(gb_cad_botones, 10, 30); 
   text(gb_cad_bit_dtmf, 10, 60);
   text('stq: '+value_stq, 10, 80);
   text('q4: '+value_q4, 10, 100);
   text('q3: '+value_q3, 10, 120);
   text('q2: '+value_q2, 10, 140);
   text('q1: '+value_q1, 10, 160);
   
   text('stq', 10, 200);
   text('q4', 10, 230);
   text('q3', 10, 270);
   text('q2', 10, 300);
   text('q1', 10, 330);   
  }
  text('dato: '+dato, 160, 380);
  text('DTMF: '+gb_cadDTMF,160,400);
  text(cad_areaRX,10,360);
  //areaRX.elt.value = cad_areaRX;    
 }
}

//Detecta Tipo de datagrama -1 si no tiene tipo
function DetectFrameData()
{
 let aReturn = -1;
 if (gb_end_sms === true)
 {
  gb_end_sms = false;
  aReturn = Number(gb_buf_rcv_dtmf[0]);
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

 auxLen = gb_buf_rcv_dtmf.length-2; //Quitamos * y Srv 0  
 cadLog += new Date(Date.now()).toLocaleString('en-GB').replace(',','');
 cadAreaRX = cadLog;
 cadLog += ' RX Srv:0';
 cadLog += ' Len:'+auxLen;
 auxLen = (Math.trunc(auxLen/2));
 cadLog += ' Chr:' + auxLen.toString();
 cont= 1; //Comienza despues servicio
 for (i=0;i<auxLen;i++)
 {
  cadDTMF += gb_buf_rcv_dtmf[cont]+gb_buf_rcv_dtmf[cont+1];
  cadBase64 += DTMFtoCharBase64(gb_buf_rcv_dtmf[cont]+gb_buf_rcv_dtmf[cont+1]);
  cont+= 2;
 }
 cadLog += ' DTMF: '+cadDTMF;
 cadLog += ' BASE64: '+cadBase64;
 cadRX = atob(cadBase64); //Base64 decode
 cadLog += ' RX:'+cadRX+' Len:'+cadRX.length;
 
 console.log(cadLog);
 cadAreaRX += ' RX:'+cadRX;
 UpdateAreaRX(cadAreaRX);
 gb_buf_rcv_dtmf = '';
}

//Procesa un SMS Tipo 1 con longitud y CRC
function ProcesSMSTipo1()
{
 let auxLen= 0;
 let auxCRC= 0;
 let cadLog=''; 
 if (gb_end_sms === true)
 {
  gb_end_sms = false;  
  //alert(gb_buf_rcv_dtmf);
  if (gb_buf_rcv_dtmf[0] === '1') //Servicio 1 SMS
  {
   auxLen = parseInt(gb_buf_rcv_dtmf[1]+gb_buf_rcv_dtmf[2]); //Longitud 2 caracteres
   auxCRC = parseInt(gb_buf_rcv_dtmf[3]+gb_buf_rcv_dtmf[4]); //CRC
   //alert (auxLen);   
   cadLog += 'RX Serv 1';
   cadLog += ' Long '+auxLen;
   cadLog += ' CRC '+auxCRC;
   console.log(cadLog);
   //gb_buf_rcv_dtmf = '';
  }
 }
}

//Procesa los buffers de datos DTMF recibidos y eventos
function PollProcessDTMF()
{
 if (gb_begin_sync_dtmf === true)
 {
  gb_begin_sync_dtmf= false; //Comienzo trama
  gb_cadDTMF +=' Sync';
  
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
	 
  gb_event_new_data_dtmf= false;//Nuevo dato
  gb_cadDTMF +=' Data';
  
  let aux_cad = gb_buf_rcv_dtmf;  
  gb_cadDTMF+=' '+StringTwoKeyDTMFToString(aux_cad);
  
  gb_forceDraw = true;
 }
}

//Rutina principal Draw Poll
function draw(){
 Poll_DTMFSound(); //Reproduce tonos DTMF
 if (gb_use_gamepad_dtmf === true){
  Poll_Pad_DTMF(); //Lee del gamepad tonos DTMF
 }
 if (gb_use_mic_dtmf === true){
  Poll_FFT_DTMF(); //Lee tonos DTMF de microfono  
 }
 PollProcessDTMF();
 PollDibujaDatos();
}