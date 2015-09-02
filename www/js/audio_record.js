/**************************************** GLOBAL VARIABLE ****************************************/
var startTime, endTime;
var flag = false;
var timeToTouch = 10;
var timeToRec = 10;
/**************************************** GLOBAL VARIABLE ****************************************/
// Audio player
//
var my_media = null;
var mediaTimer = null;
var myFileName = "audio\myfile001.wav";
var meFileRecord = null;
var recInterval = null;
var setInt = 10;
var recStatus = 0;
var playStatus = 0;


/* ******************** RECORD AUDIO ******************** */

function recordAudioPush() {
    if (recStatus == 0){
        iniRecordAudioPush();
    }
    else{
        stopRecordAudioPull();
    }
}

function onConfirm(buttonIndex) {
    alert('You selected button ' + buttonIndex);
    alert(buttonIndex(0));
    alert(buttonIndex[0]);
}

function iniRecordAudioPush() {
    alert('iniRecordAudioPush');
    //var meFileRecord = new Media(myFileName, onSuccess('Record'), onError);
    meFileRecord = new Media(myFileName, onSuccess('Record'), onError);

    // Record audio
    meFileRecord.startRecord();
    recStatus = 1;
}


function stopRecordAudioPull(){

    alert('stopRecordAudioPull');

    recStatus = 0;
    clearInterval(recInterval);
    meFileRecord.stopRecord();
    //document.getElementById('recordAudio_Push').src="img/micro_push.png";

    playStatus=0;
    //document.getElementById('playAudio_Push').style.visibility="visible";
}

/* ***************************************************************************** */

/* ------------- TOUCH START -------------*/
document.getElementById('recordAudio_Push').addEventListener('touchstart',function(event) {
    startTime = new Date().getTime();
    flag = false;

    document.getElementById('divlegend').style.visibility="visible";
    //document.getElementById('recImg').style.visibility="visible";
    //document.getElementById('recordAudio_Push').src="img/micro_push_rec.png";
    //document.getElementById('playAudio_Push').style.visibility="hidden";

    recStatus=0;
    recordAudioPush();

},false);

/* ------------- TOUCH MOVE (CANCELAR) -------------*/
document.getElementById('recordAudio_Push').addEventListener('touchmove',function(event) {

    //Limpiamos etiquetas de segundos
    //setAudioPosition("", 0);

    //Provocamos parar la grabación
    meFileRecord = null
    clearInterval(recInterval);
    //meFileRecord.stopRecord();
    recStatus = 0;

    //Ocultamos leyenda de Cancelar
    document.getElementById('divlegend').style.visibility="hidden";

    // Ocultamos el icono de grabacion que parpadea
    //document.getElementById('recImg').style.visibility="hidden";

    // Ponemos el botón de Graba en inicio (en negro)
    //document.getElementById('recordAudio_Push').src="img/micro_push.png";

    // Ocultamos el boton de PLAY
    //document.getElementById('playAudio_Push').style.visibility="hidden";
    playStatus=0;

    flag = true;

    alert('Se ha cancelado la grabación');

},false);

/* ------------- TOUCH END -------------*/
document.getElementById('recordAudio_Push').addEventListener('touchend',function(event) {

    //Provocamos parar la grabación
    clearInterval(recInterval);
    meFileRecord.stopRecord();
    recStatus = 0;


    endTime = new Date().getTime();

    //Limpiamos etiquetas de segundos
    //setAudioPosition("", 0);

    if(!flag) {
        // ha ido bien

        //Ocultamos leyenda de Cancelar
        document.getElementById('divlegend').style.visibility="hidden";

        // Ocultamos el icono (pequeño) de grabacion que parpadea
        //document.getElementById('recImg').style.visibility="hidden";
        //document.getElementById('recImg').src="img/micro_push_rec.png";

        // Ponemos el botón de Graba en inicio (en negro)
        //document.getElementById('recordAudio_Push').src="img/micro_push.png";

        // Mostramos el boton de PLAY
        //document.getElementById('playAudio_Push').style.visibility="visible";
        //document.getElementById('playAudio_Push').src="img/play.png";
        playStatus=0;
    }
    else{
        //No ha ido bien

        //Ocultamos leyenda de Cancelar
        document.getElementById('divlegend').style.visibility="hidden";

        // Ocultamos el icono de grabacion que parpadea
        //document.getElementById('recImg').style.visibility="hidden";
        //document.getElementById('recImg').src="img/micro_push_rec.png";

        // Ponemos el botón de Graba en inicio (en negro)
        //document.getElementById('recordAudio_Push').src="img/micro_push.png";

        // Ocultamos el boton de PLAY
        //document.getElementById('playAudio_Push').style.visibility="hidden";
        //document.getElementById('playAudio_Push').src="img/play.png";
        playStatus=0;

    }

    startTime = null;
    endTime = null;
    flag = false;

},false);


