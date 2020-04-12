//Diccionario Espaniol
const gb_dic_ES = new Array('ABRAZOS','XXXX','ACA','AK','ACABO','ACBO','ADEMAS','ADMS','ADIOS','AZ','AHORA','AOA','ALGO','ALG','ALGUNAS','SOME','ALGUNOS','ALGNS','ANOS','ANS','ANTE','ANT','ANTES','ANTS','AQUI','AKI','AUNQUE','AIQ','AYER','AER',
'BARBACOA','BBQ','BAJA','BJ','BESO','X','BESOS','BSS','BESITOS','B7S','BIEN','BN','BUENAS','GOOD','BUENA','BA','BUENO','BNO',
'CABRON','KBRON','CADA','CAD','CALLATE','KYAT','CARGADOR','CRG','CASA','QTH','CASO','CAS','CERO','O','CHAT','XAT','CINCO','FIVE','CIUDAD','CITY','CLASE','KLS','COBERTURA','CBT','COLEGA','CLGA','COMO','AS','COMPUTADORA','PC','CON','CN','CONTRA','CONTR','COSAS','COSS','CUAL','CUA','CUANDO','QNDO','CUANTO','HOW','CUATRO','4','CUELGA','CLG','CUENTA','BILL','CUENTAME','KNTM',
'DE','D','DEBE','DB','DECIR','DCI','DEDOS','DZ','DEL','DL','DEN','DN','DENTRO','DNTR','DESDE','DSD','DESPUES','DSPS','DICE','DIC','DIFICIL','DFCL','DIGE','DIG','DIGA','DGA','DIGO','DGO','DIJO','DIJ','DISCO','DSK','DONDE','DND','DORMIDA','DRMDA','DOS','Z','DURANTE','DURNT',
'EL','L','ELEFANTE','LFNT','ELLA','ELA','ELLO','EYO','ELLOS','EYS','EMAIL','EM','EMBARGO','MBRG','ENFADADO','GRR','ENTONCES','SO','ENTRE','NTR','ERES','ERS','ES','S','ESPANA','SPAN','ESPERO','SPRO','ESTA','TA','ESTADO','TADO','ESTAN','TAN','ESTAS','STS','ESTE','ST','ESTO','IT','ESTOS','ETOS','ESTOY','TOY','EXAMEN','XAM',
'FACEBOOK','FB','FELIZ','XD','FIN','FN','FINDE','FIND','FORMA','FRMA','FOTO','FT','FRENTE','FNT','FUERON','FERN',
'GANAS','GNS','GENERAL','GNRL','GENIAL','GNL','GOBIERNO','GOB','GRACIAS','ASIAS','GRAN','GRN','GRANDE','GRND','GRUPO','GRUP','GUAPA','WPA',
'HABIA','ABIA','HACE','ACE','HACER','ACR','HACES','ACS','HACIA','ACIA','HAN','AN','HASTA','H','HECHO','EXO','HERMANO','RMNO','HIJOPUTA','HP','HISTORIA','ISTO','HOLA','HI','HOMBRE','OMBR','HORA','HR','HOY','OY',
'INSTITUTO','IES','INSTI','NSTI','INTERNET','NET',
'JODETE','JDT',
'KILOMETRO','KM','KILOMETROS','KM',
'LE','L','LISTADO','LIST','LOS','LS','LUEGO','LGO','LUGAR','LG',
'MADRID','MDRD','MANANA','MNN','MAMA','MA','MANDA','MNDA','MANDE','MAND','MANDO','MNDO','MANERA','MNR','MAYOR','MAOR','ME','M','MEDIO','MDIO','MEJOR','MJR','MENOS','MNS','MENSAJE','SMS','METETE','MTT','MIERDA','KK','MILLONES','MIYONS','MISMA','MMA','MISMO','MMO','MOMENTO','MMNT','MOTO','MTO','MOVIL','MVL','MUCHO','MX','MUCHOS','MXX','MUJER','MUJR','MUNDO','MND','UY','MU',
'NACIONAL','NCIONL','NADA','ND','NEVAR','NVR','NEVARA','NVRA','NEVERA','NVR','NEVO','NVO','NIEVA','NIVA','NIEVE','NVE','NO','N','NOCHE','NXE','NOS','NS','NOSOTROS','NST','NOTICIAS','NEWS','NUESTRA','NUET','NUEVA','NEVV','NUEVE','9','NUEVO','NUE','NUNCA','NNCA',
'OCHO','B','OPERATIVO','OPRATV','ORDENADOR','PC','OTRAS','OTAS','OTRO','OTR','OTROS','OTRS',
'PAIS','PAI','PAPA','PA','PARA','XA','PARTE','PART','PARTIDA','PRTDA','PARTIDO','MATCH','PARTIDOS','PRTDS','PASADO','PAST','PASO','PSO','PEDO','PDO','PEQUENO','PK','PERDON','XDON','PERO','XO','PERSONA','PRSON','PERSONAS','PRSONS','PIERDETE','PDT','PISCINA','POOL','PLOMO','PB','POCO','PCO','PODER','PDR','POLITICA','PLITC','POLITICO','PLTICO','POR','X','PORFA','XFA','PORQUE','PK','PRESIDENTE','PESIDNT','PRIMER','PRMR','PRINCIPIO','PPIO','PROFESOR','PRF','PUBLICADAS','POSTED','PUEDE','PUED','PUEDEN','PUDN','PUES','PUE','PUDE','PUD','PUNTO','PNT',
'QUE','Q','QUEDADA','QDDA','QUEDAMOS','KDMS','QUIEN','QIN','QUIERES','QRS',
'REPITELO','RPTLO','RESPONDE','R','RISA','RSA',
'SABADO','SBDO','SABES','SBS','SALIMOS','SLMOS','SALUDOS','SALUZ','SE','S','SEGUN','SGU','SEIS','6','SEMANA','SMN','SER','ER','SIDO','SDO','SIEMPRE','SEMPR','SIETE','7','SISTEMA','SYS','SOBRE','SBR','SUERTE','SRT',
'TAL','TL','TAMBIEN','TB','TAMPOCO','TP','TANTO','TANT','TE','T','TEN','TN','TENER','TNR','TENIA','HAD','TIEMPO','TIME','TIENE','TIEN','TIENEN','TENN','TIPO','TYP','TODAS','ALL','TODO','TD','TODOS','TODS','TONTO','TNTO','TRABAJO','JOB','TRAS','TRA','TRES','3','TWEET','TW',
'ULTIMAS','UIMS','UNO','I','UNOS','UNS','UTENSILIO','UTNSLO',
'VACACIONES','VAC','VALE','OK','VECES','VCS','VEMOS','VMS','VEZ','VZ','VIENES','VNS','VIERNES','VRNS','VOSOTROS','VOS',
'GUAY','WAY',
'XANA','XNA','XANTINA','XNTINA',
'YATE','YT',
'ZONA','ZN','ZONAS','ZNS'
);


//Descomprime una cadena aplicando un diccionario
function TextoDescomprimeDiccionario(cadOrigen)
{
 let aReturn = '';
 let beforeflipFlopUpper = false;
 try
 {
  let i = 0;
  let j = 0;
  let cadAux='';  
  let isUpper = (cadOrigen[0].toUpperCase() === cadOrigen[0])? true: false;
  let isUpper_before = isUpper;
  let auxLen = cadOrigen.length;
  let cadDecompress='';
  let auxSearch= false;
  for (i=0; i < auxLen; i++)
  {   
   isUpper = (cadOrigen[i].toUpperCase() === cadOrigen[i])? true: false;  
   if (
       (isUpper_before != isUpper)
	   ||
	   (i === (auxLen-1))
	  )
   {//Cambio de mayusculas o minuscula, es un espacio
	isUpper_before = isUpper;
	cadAux += (i === (auxLen-1))? cadOrigen[i]: ''; //Ultimo caracter, ultima palabra
	
	cadAux = cadAux.toUpperCase(); //convertimos a mayusculas
    auxSearch = false;
    cadDecompress = '';
    for (j=0;j<(gb_dic_ES.length-1);j+=2)
    {
	 if (gb_dic_ES[j+1] === cadAux)
	 {	 
	  cadDecompress = gb_dic_ES[j];
	  auxSearch = true;
	  break;
	 }
    }
    if (auxSearch === true)
	{
	 aReturn += cadDecompress;	 
	}
    else
	{
	 aReturn += cadAux; //No decodifica palabra
    }
	aReturn += (i === (auxLen-1))? '':' '; //Si no es ultima palabra aniade espacio
	cadAux = '';
   }      
   cadAux += cadOrigen[i];
  }
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }
 return aReturn;
}

//Comprime una cadena aplicando un diccionario
function TextoComprimeDiccionario(cadOrigen)
{
 let aReturn = '';
 let flipFlopUpper = false;
 try
 {
  let splitArray = cadOrigen.split(' ');
  let i = 0;
  let j = 0;
  let cadAux='';
  let auxSearch = false;
  let cadCompress = '';
  for (i=0; i<splitArray.length; i++)
  {   
   cadAux = splitArray[i].toUpperCase(); //convierto mayusculas
   cadAux = cadAux.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
   auxSearch = false;
   cadCompress = '';
   for (j=0;j<gb_dic_ES.length;j+=2)
   {
	if (gb_dic_ES[j] === cadAux)
	{	 
	 cadCompress = gb_dic_ES[j+1];
	 auxSearch = true;
	 break;
	}	
   }
   flipFlopUpper = !flipFlopUpper; //Sustituimos espacios por cambio Mayusculas Minusculas
   if (auxSearch === true)
   {     	 
	cadCompress = (flipFlopUpper === true) ? cadCompress.toUpperCase() : cadCompress.toLowerCase();
	aReturn += cadCompress;
   }
   else
   {//Si no comprime deja misma palabra
	aReturn += (flipFlopUpper === true)? cadAux.toUpperCase() : cadAux.toLowerCase();
   }
  }  
 }
 catch(err)
 {  
  DebugLog(err.message.toString());
 }
 return aReturn;
}