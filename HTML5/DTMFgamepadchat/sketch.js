//Autor: Jaime Jose Gavin Sierra
//EA1HLX
//Ackerman
//Chat over dtmf.
// Received gamepad MT8870 and Sound Card mic or line in
// Send: Sound Card
// # - Comienzo sms
// 

var id_stq,id_q4,id_q3,id_q2,id_q1;
var value_stq,value_q4,value_q3,value_q2,value_q1;
var value_stq_antes,value_q4_antes,value_q3_antes,value_q2_antes,value_q1_antes;

var gb_cad_bit_dtmf='';
var stq_antes=0;
var dato=0;
var gb_cadDTMF='';

var areaRX;
var forceDraw = false;
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
var gb_current_array_dtmf = 0;
var gb_total_array_dtmf = 0;
var gb_array_dtmf = ['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'];
var gb_play_array_dtmf= false;
var gb_begin_dtmf = false;
var gb_end_dtmf = false;
var gb_begin_silence = false;
var gb_end_silence = false;
var gb_ini_dtmf;

var mic, fft;
var gb_fft_dtmf='';
var gb_fft_dtmf_antes='';
var gb_ini_fft_dtmf = false;
var gb_ini_fft_dtmf_time;

//Rutina principal Setup inicial
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Courier');
  textSize(20);

  areaRX = createElement('textarea');
  areaRX.position(110,110);
  areaRX.style('width','200px');
  areaRX.style('height','70px');
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
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);  
  
	  
  forceDraw = true;  
}

function StopSound(){
 gb_oscTone1.stop();
 gb_oscTone2.stop();
 gb_play_array_dtmf = false;
}

function ClearDtmf(){
 cad_areaRX='';
 forceDraw = true;
 
 alert(StringTo2KeyDTMF('esto es una prueba'));
}

function PruebaSendDTMF(){
 //gb_oscTone1.start();
 //gb_oscTone2.start();
 //let cadSend='0123456789ABCD*#' 
 //let cadSend=StringTo2KeyDTMF('Prueba');
 let cadSend=StringTo2KeyDTMF('pueb');
 alert(cadSend);
 let i=0;
 gb_array_dtmf[0]='#';
 for (i=1;i<cadSend.length;i++){
  gb_array_dtmf[i] = cadSend[i];
 }
 //gb_array_dtmf[0]='3';
 //gb_array_dtmf[1]='B';
 //gb_array_dtmf[2]='7';
 //gb_array_dtmf[3]='D';
 //gb_array_dtmf[4]='8';
 //gb_array_dtmf[5]='A';
 //gb_array_dtmf[6]='6';
 
 //3B7D8A6C1A3B7D1A8B6B2A1A7A7C8B3B2B2A
 
 gb_total_array_dtmf= cadSend.length-1;
 gb_current_array_dtmf = 0;
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
function KeyDTMFTochar(valor){
 let aReturn='';
 switch(valor){
  case '2A': aReturn= 'A';break;
  case '2B': aReturn= 'B';break;
  case '2C': aReturn= 'C';break;
  case '3A': aReturn= 'D';break;
  case '3B': aReturn= 'E';break;
  case '3C': aReturn= 'F';break;
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
 return aReturn;
}

//Convierte un string a 2-key dtmf
function StringTo2KeyDTMF(cad){
 let aReturn='';
 for (var i=0;i<cad.length;i++){
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
   valor = gb_array_dtmf[gb_current_array_dtmf];  
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
	if ((millis()-gb_ini_dtmf)>=500){
	//if ((millis()-gb_ini_dtmf)>=250){
	 gb_begin_dtmf = false;
     gb_end_dtmf = false;
     gb_begin_silence = false;
     gb_end_silence = false;
	 gb_current_array_dtmf++;
	 if (gb_current_array_dtmf>gb_total_array_dtmf){
	  gb_current_array_dtmf= 0;
      StopSoundDTMF();
	  gb_play_array_dtmf = false;
	 }
	}
   }
   else{
    if ((millis()-gb_ini_dtmf)>=400){	 	
	//if ((millis()-gb_ini_dtmf)>=150){
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
 let aReturn='';
 if ((row === 0) && (col === 0)){aReturn='1'}
 if ((row === 0) && (col === 1)){aReturn='2'}
 if ((row === 0) && (col === 2)){aReturn='3'}
 if ((row === 0) && (col === 3)){aReturn='A'}
 if ((row === 1) && (col === 0)){aReturn='4'}
 if ((row === 1) && (col === 1)){aReturn='5'}
 if ((row === 1) && (col === 2)){aReturn='6'}
 if ((row === 1) && (col === 3)){aReturn='B'}
 if ((row === 2) && (col === 0)){aReturn='7'}
 if ((row === 2) && (col === 1)){aReturn='8'}
 if ((row === 2) && (col === 2)){aReturn='9'}
 if ((row === 2) && (col === 3)){aReturn='C'}
 if ((row === 3) && (col === 0)){aReturn='*'}
 if ((row === 3) && (col === 1)){aReturn='0'}
 if ((row === 3) && (col === 2)){aReturn='#'}
 if ((row === 3) && (col === 3)){aReturn='D'}  
 return (aReturn);
}

//Analiza las frecuencias desde Tarjeta Sonido
function Poll_FFT_DTMF(){
  //44100 / 1024 = 43,06 Hz saltos  21,533203125 Hz
  //var sampleRate= sampleRate();  
  let sampleRate= 22050;
  //Tecla 1  es 697 Hz y 1209 Hz  Posicion FFT 
  let spectrum = fft.analyze();
  //var ancho = Math.round(sampleRate/spectrum.length);
  let ancho = sampleRate/spectrum.length;
  //let cadLog=''+sampleRate.toString()+' '+spectrum.length.toString()+' '+Math.round(ancho).toString()+' ';

  //beginShape();
  //console.log(spectrum.length);
  let row= -1;
  let col= -1;  
  for (i = 0; i < spectrum.length; i++) {
    //vertex(i, map(spectrum[i], 0, 255, height, 0));
	
	if ((i === 31) //697 Hz 689
	   ||
	   (i === 35) //770 Hz 775
	   ||
	   (i === 39) //852 Hz  861
	   ||
	   (i === 43) //941 Hz 947
	   ||
	   (i === 55) //1209 Hz 1206
	   ||
	   (i === 61) //1336 Hz 1335
	   ||
	   (i === 67) //1477 Hz 1464
	   ||
	   (i === 76) //1663 Hz 1658
	   )
	{
	 valor = spectrum[i];
	 if (valor>250){
	  switch (i){
	   case 31: row= 0; break;
	   case 35: row= 1; break;
	   case 39: row= 2; break;
	   case 43: row= 3; break;
	   case 55: col= 0; break;
       case 61: col= 1; break;
       case 67: col= 2; break;
       case 76: col= 3; break;	   
	   default: row= -1; col= -1; break;
	  }	  
	 }
	 //cadLog+=(Math.round((i+1)*ancho)).toString()+':'+spectrum[i].toString()+'|';
	}
  }
  
  //if ((row>-1) && (col>-1)){
  // gb_fft_dtmf = RowColToDtmf(row,col);
  // gb_cadDTMF = gb_fft_dtmf;
  // cad_areaRX += gb_cadDTMF;
  //}
		
  if ((row>-1) && (col>-1)){
   gb_fft_dtmf = RowColToDtmf(row,col);
   if (gb_ini_fft_dtmf === false){
	gb_ini_fft_dtmf = true;
    gb_ini_fft_dtmf_time = millis();
   }
   else{
	if (gb_fft_dtmf === gb_fft_dtmf_antes){
	 if ((millis()-gb_ini_fft_dtmf_time) >= 40){ //40 miliseconds
	  //cadLog+=' Premio ';
      if (gb_fft_ok_dtmf === false){  	   
	   gb_cadDTMF = gb_fft_dtmf;
	   cad_areaRX += gb_cadDTMF;
	   forceDraw = true;		  
	   gb_fft_ok_dtmf= true;
	   //gb_ini_fft_dtmf = false;
	  }	  
	 }
	}
	else{
	 gb_fft_dtmf_antes = gb_fft_dtmf;
	 gb_ini_fft_dtmf = false;	 
	 gb_fft_ok_dtmf = false;
	}
   }
  }
  else{
   gb_fft_dtmf = gb_fft_dtmf_antes = '';
   gb_ini_fft_dtmf = gb_fft_ok_dtmf = false;   
  }
  
  //cadLog+=' '+row.toString()+'x'+col.toString()+' '+gb_fft_dtmf; 
   
  //endShape();
  //areaRX.elt.value = cadLog;
  //console.log(cadLog);
}







function Poll_Pad_DTMF(){
 let pads = navigator.getGamepads();
 let pad0 = pads[0];
 if (pad0){
  gb_cad_botones='';
  for (var i=0;i<pad0.buttons.length;i++){
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
   forceDraw = true;
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
  forceDraw = true;
 }
 
 if (value_stq != stq_antes){
  if ((stq_antes === 0) && (value_stq === 1)){   
   cad_areaRX += gb_cadDTMF;
   forceDraw = true;
  }	 
  stq_antes = value_stq;
 }	
}


//Rutina principal Draw Poll
function draw(){
 Poll_DTMFSound();
 
 //Poll_Pad_DTMF(); 
 
 Poll_FFT_DTMF();

 if (forceDraw === true)
 {
  forceDraw = false;
  background(255);
  fill(0, 0, 0); 
  text(gb_cad_botones, 10, 30); 
  text(gb_cad_bit_dtmf, 10, 60);
  text('stq: '+value_stq, 10, 80);
  text('q4: '+value_q4, 10, 100);
  text('q3: '+value_q3, 10, 120);
  text('q2: '+value_q2, 10, 140);
  text('q1: '+value_q1, 10, 160);
  text('dato: '+dato, 160, 80);
  text('DTMF: '+gb_cadDTMF,160,100);
  areaRX.elt.value = cad_areaRX;
  
  text('stq', 10, 200);
  text('q4', 10, 230);
  text('q3', 10, 270);
  text('q2', 10, 300);
  text('q1', 10, 330);
 }  
}