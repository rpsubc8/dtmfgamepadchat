# CHAT DTMF
Envio de SMS's bajo tonos DTMF, con decodificación en tiempo real usando micrófono o gamepad (MT8870 conectado a joystick), bajo HTML5.
<center><img src='preview/previewChatTabRX.gif'></center>
<br><br>

<ul>
 <li><a href='#interface'>Interface<a/></li>
 <li><a href='#html5'>HTML5<a/></li>
 <li><a href='#opciones'>Opciones<a/></li>
 <li><a href='#estado'>Estado del proyecto<a/></li>
</ul>

<br>
<a name="interface"><h2>Interface</h2></a>
Se permiten varios interfaces:
<ul>
 <li>Micrófono o entrada de linea</li>
 <li>Salida de linea o altavoces</li>
 <li>Joystick o gamepad modificado con MT8870</li>
 <li>Arduino emulando joystick (en desarrollo)</li>
</ul>
Aunque el uso del MT8870 implica un poco más de dificultad, se consigue mucha más velocidad y precisión a la hora de decodificar tonos DTMF.
Gracias al chip MT8870, conectando las salidas de STQ, Q4, Q3, Q2 y Q1 a un transistor permitiendo abrir o cerrar
los botones de un GAMEPAD, se puede decodificar tonos DTMF. Tan sólo necesitamos 5 pines (botones de mando).
<center><img src='preview/interfacePAD.jpg'></center>
Tendremos que localizar con multímetro los 5V de alimentación del USB del mando, para poder alimentar el MT8870, así como la masa en común.
<center><img src='preview/interfaceMT8870.gif'></center>
En este ejemplo, el mando, se ha optado por los siguientes botones, pero pueden variar, y tendremos que tenerlo en cuenta en la aplicación:
<ul>
 <li><b>STQ</b> (botón 3)</li>
 <li><b>Q4</b> (botón 5)</li>
 <li><b>Q3</b> (botón 6)</li>
 <li><b>Q2</b> (botón 9)</li>
 <li><b>Q1</b> (botón 10)</li>
</ul>


<br><br>
<a name="html5"><h2>HTML5</h2></a>
Se ha optado por HTML5 (js) para poder conseguir la máxima portabilidad. El interface actual no es el definitivo, dado que se ha usado algo simple para pruebas de funcionalidad.

<br><br>
<a name="opciones"><h2>Opciones</h2></a>
<center><img src='preview/captureOptions.gif'></center>
Si seleccionamos el botón de TabPAD, podremos acceder a todas las opciones:
<ul>
 <li>Gamepad (lee tonos DTMF desde gamepad)</li>
 <li>Micrófono (lee tonos DTMF desde micrófono o entrada de linea)</li>
 <li>PTT (Número de tono D que se envia para activar VOX)</li>
 <li>Fullduplex (Permite decodificar al mismo tiempo que envia)</li>
 <li>Log Debug (saca un log por consola)</li>
 <li>Vel (Velocidad de envio DTMF)</li>
 <li>STQ (botón del PAD para pin STQ del MT8870)</li>
 <li>Q4 (botón del PAD para pin Q4 del MT8870)</li>
 <li>Q3 (botón del PAD para pin Q3 del MT8870)</li>
 <li>Q2 (botón del PAD para pin Q2 del MT8870)</li>
 <li>Q1 (botón del PAD para pin Q1 del MT8870)</li> 
</ul>
Se puede tener al mismo tiempo activo el Gamepad y Micrófono para poder decodificar al mismo tiempo de ambos sitios, pero lo normal es tener sólo uno activo (el que vayamos a usar).<br>
El PTT equivale a enviar la tono 'D' tantas veces como este especificado. De esta forma, permitirá abrir el VOX de un talkie.<br>
El fullduplex es útil para test, ya que nos permite una especie de ECO, si hacemos un envio para ver en el propio equipo lo que se recibe, pero lo normal es tenerlo desactivado mientras se transmite.
<br><br>

<a name="estado"><h2>Estado del proyecto</h2></a>
<ul>
 <li>Fase 1 - Simple Chat</li>
 <li>Fase 2 - Aumento de servicios (en desarrollo)</li>
 <li>Fase 3 - Aumento de velocidad (en desarrollo)</li>
 <li>Fase 4 - Enlaces (en desarrollo)</li>
</ul>
