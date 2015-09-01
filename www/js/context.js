var context;
var sound;
var source;


var audio = new Audio();
audio.loop = false;
audio.autoplay = false;

window.addEventListener("load", initMp3Player, false);

function initMp3Player(){

    //context = new webkitAudioContext();
    context = (window.AudioContext || window.webkitAudioContext)();
    analyser = context.createAnalyser();

    canvas = document.getElementById('analyser_render');
    ctx = canvas.getContext('2d');
    source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

}

function deviceReady() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();

    }
    catch (ex){alert('deviceReady: '+ex.message);}
}

function Reproducir0(){
    v_fichero = "audio/1ra-e.mp3";
    loadSound_2(v_fichero);
}


function Reproducir1(){
    var v_fichero = _mediaAudioFicheroIOS;
    v_fichero = "audio/1ra-e.mp3";
    loadSound(v_fichero);
}

function Reproducir(){
    alert('Reproducir1');
    var v_fichero = ObtenerFicheroAudio();
    v_fichero = "audio/testaudio.wav";
    loadSound(v_fichero);
}


var mySource;
function bufferSoundiOS(event) {
    alert('Entra bufferSoundiOS');
    var request = event.target;
    var source = context.createBufferSource();
    source.buffer = context.createBuffer(request.response, false);
    mySource = source;
    source.start(0);
}

function loadSound_2(url) {
    try
    {
        // Create a instance of AudioContext interface
        window.AudioContext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
        context = new AudioContext();

        var source = context.createBufferSource(); //this represents the audio source. We need to now populate it with binary data.

        try{
            if(esIOS()){
                source.noteOff(0);
            }
            else{
                source.stop();
            }

        }
        catch (ex) {}

        //now retrieve some binary audio data from <audio>, ajax, input file or microphone and put it into a audio source object.
        //here we will retrieve audio binary data via AJAX
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer'; //This asks the browser to populate the retrieved binary data in a array buffer
        request.onload = function(){
            //populate audio source from the retrieved binary data. This can be done using decodeAudioData function.
            //first parameter of decodeAudioData needs to be array buffer type. So from wherever you retrieve binary data make sure you get in form of array buffer type.
            context.decodeAudioData(request.response, function(buffer) {
                source.buffer = buffer;
            }, null);
        }
        request.send();

        //now we got context, audio source.
        //now lets connect the audio source to a destination(hardware to play sound).
        source.connect(context.destination);//destination property is reference the default audio device

        /*
         If we wanted to add any audio nodes then we need to add them in between audio source and destionation anytime dynamically.
         */

        //now play the sound.

        if(esIOS()){
            source.noteOn(0);
        }
        else{
            source.start(0);
        }

    }
    catch(e)
    {
        alert("Web Audio API not supported");
    }
}

function loadSound(url) {
    try {
        //alert(url);
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        alert('loadSound1');

        if(esIOS()){
            alert('esIOS: loadSound');
            request.addEventListener('load', bufferSoundiOS, false);
        }
        else{
            //NOOO // request.addEventListener('load', bufferSound, false);
            /*request.onload = function() {
                alert('loadSound2');
                context.decodeAudioData(request.response, function(buffer) {
                    alert('ok');
                    sound = buffer;
                    playSound(sound);
                    alert('Después playSound');
                },ErrorLoad);
            }*/
        }

//        request.onload = function () {
//            // request.response is encoded... so decode it now
//            alert('antes');
//            context.decodeAudioData(request.response, function (buffer) {
//alert('ok');
//                sound = buffer;
//            }, function (err) {
//                alert('error');
//                alert(err.message);
//            });
//        }

        request.send();
    }
    catch (ex){alert('loadSound: '+ex.message);}
}

function ErrorLoad(e) {
    alert(e.message);
}
function playSound(buffer) {
    alert('entra playSound');
    source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    alert('Antes start');
    source.start(0);
    alert('Después start');
}

function parar(){
    source.stop();
}

function play(idx){
    switch(idx) {
        case 0:
            audio.src = "audio/1ra-e.mp3";
            break;
        case 1:
            audio.src = "audio/testaudio.wav";
            break;
    }
    audio.play();
}


/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/
/***********************************************************************************************************/


function ObtenerFicheroAudio(){
    if(esIOS())
    {
        //alert('ios');
        //return _mediaAudioFicheroIOS;
        return _mediaAudioFicheroIOSFullPath;
    }
    else
    {
        //alert('no ios');
        return _mediaAudioFichero;
    }
}

function AudioGrabacionConfirma() {
    try{
        alert('1.1- AudioGrabacionConfirma');
        var v_mensaje = "s'està gravant al teu missatge de veu...";
        var v_titulo = "Gravació";
        var v_botones = "Finalitzar,Descartar";

        var v_imagen = document.getElementById('imgAudioPlay');
        v_imagen.src = "images/play_gray.png";

        //Iniciar Grabación
        var v_fichero=ObtenerFicheroAudio();
        alert('1.2- Fichero: ' + v_fichero);

        _mediaAudio = new Media(v_fichero,onSuccessAudio,onErrorAudio);
        _mediaAudio.startRecord();

        alert('1.3- ' + startRecord);

        if(navigator.notification && navigator.notification.confirm){
            alert('1.4- navigator.notification');
            navigator.notification.confirm(v_mensaje,AudioGrabacion,v_titulo,v_botones);
        }
        else
        {
            alert('1.5- ' + v_mensaje);
            var v_retorno = confirm(v_mensaje);
            if (v_retorno){
                AudioGrabacion(1);
            }
            else {
                AudioGrabacion(2);
            }
        }
    }
    catch (ex){mensaje('ERROR - ' + ex.message,"error");}
}
function onSuccessAudio() {
}

function onErrorAudio(error) {
    _inciAudioFichero='';
    mensaje(error.message,"error");
}

function AudioGrabacion(respuesta){
    try{
        //Finalizar grabación
        _mediaAudio.stopRecord();
        if (respuesta==1) {
            if(esIOS())
            {
                window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, ConvertirFicheroAudioToBase64IOS, onErrorAudio);

            }
            else {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, ConvertirFicheroAudioToBase64, onErrorAudio);
            }
        }
        else{
            _inciAudioFichero='';
            var imagen = document.getElementById('buttonAudioPlay');
            imagen.src = "images/play_gray.png";
        }
    }
    catch (ex){mensaje(ex.message,"error");}

}

function ConvertirFicheroAudioToBase64(fileSystem) {
    fileSystem.root.getFile(_mediaAudioFichero, null, LeerFicheroAudio, onErrorAudio);
}
function LeerFicheroAudio(fileEntry) {
    fileEntry.file(LeerFicheroAudioOK, onErrorAudio);
}
// the file is successfully retreived
function LeerFicheroAudioOK(file){
    TransformarFicheroAudioToBase64(file);
}
// turn the file into a base64 encoded string, and update the var base to this value.
function TransformarFicheroAudioToBase64(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        _inciAudioFichero = evt.target.result;
        _inciAudioFichero  =   _inciAudioFichero.toString().substring(_inciAudioFichero.toString().indexOf(",")+1);
        var imagen = document.getElementById('imgAudioPlay');
        imagen.src = "images/play_red.png";
    };
    reader.readAsDataURL(file);
}

function MostrarAudioReproducir(){
    if (_inciAudioFichero !='') {
        $('#divDatosIncidenciaAudioPlay').show();
    }
    else{
        mensaje("No hi ha fitxer d'àudio per reproduir","avís");
    }
}
function AudioReproducir(){

    if (_inciAudioFichero !=''){
        //var v_imagen1 = document.getElementById('imgAudioPlayPlay');
        //v_imagen1.src = "images/play_gray.png";
        //var v_imagen2 = document.getElementById('imgAudioPlayStop');
        //v_imagen2.src = "images/play_gray.png";

        //Iniciar Reprodución
        //var v_src="data:audio/mpeg;base64," +_inciAudioFichero;
        var v_fichero = ObtenerFicheroAudio();
        _mediaAudio = new Media(v_fichero,onSuccessAudioPlay,onErrorAudioPlay);
        _mediaAudio.play();
        if (_mediaTimer == null) {
            _mediaTimer = setInterval(function() {
                // get my_media position
                _mediaAudio.getCurrentPosition(
                    // success callback
                    function(position) {
                        if (position > -1) {
                            var iPos = parseInt(position);
                            setAudioPosition(iPos+" seg.");
                        }
                    },
                    // error callback
                    function(e) {
                        setAudioPosition("Error: " + e.message);
                    }
                );
            }, 1000);
        }
    }

}

function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
    document.getElementById('audio_position').style.color='#b80529';
}

function onSuccessAudioPlay() {
}

function onErrorAudioPlay(error) {
    if(error!=null && error.message!=null) {
        mensaje(error.message, "error");
    }
}

function stopAudio() {
    if(_mediaAudio!=null && _mediaAudio){
        _mediaAudio.stop();
    }
    clearInterval(_mediaTimer);
    _mediaTimer=null;
}

function pauseAudio() {
    if(_mediaAudio!=null && _mediaAudio) {
        _mediaAudio.pause();
    }
}


function cerrarAudio() {
    if(_mediaAudio!=null && _mediaAudio) {
        _mediaAudio.stop();
    }
    _mediaAudio=null;
    _mediaTimer=null;
    $('#divDatosIncidenciaAudioPlay').hide();
}

//--------------------------------------------------------------------------------------------
//Tratar audio IOS
//--------------------------------------------------------------------------------------------
function ErrorCrearFicheroAudioIOS() {
    if(error!=null && error.message!=null) {
        mensaje("Error creació fitxer audio:\n"+error.message, "error");
    }
}
function CrearFicheroAudioIOS(fileSystem) {
    fileSystem.root.getFile(_mediaAudioFicheroIOS, {create: true, exclusive: false}, CrearFicheroAudioIOSCorrecto, CrearFicheroAudioIOSError);
}

function CrearFicheroAudioIOSError(error) {
    if(error!=null && error.message!=null) {
        mensaje("Error creació fitxer audio:\n"+error.message, "error");
    }
}

function CrearFicheroAudioIOSCorrecto(fileEntry) {
    _mediaAudioFicheroIOSFullPath=fileEntry.fullPath;

}


function ConvertirFicheroAudioToBase64IOS(fileSystem) {
    fileSystem.root.getFile(_mediaAudioFicheroIOS,{create: false,exclusive:false}, LeerFicheroAudioIOS, onErrorAudio);
}

function LeerFicheroAudioIOS(fileEntry) {
    fileEntry.file(LeerFicheroAudioOKIOS, onErrorAudio);
}

function LeerFicheroAudioOKIOS(file){
    TransformarFicheroAudioToBase64IOS(file);
}

function TransformarFicheroAudioToBase64IOS(file) {
    file.type='audio/wav';
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        _inciAudioFichero = evt.target.result;
        _inciAudioFichero  =   _inciAudioFichero.toString().substring(_inciAudioFichero.toString().indexOf(",")+1);
        var imagen = document.getElementById('imgAudioPlay');
        imagen.src = "images/play_red.png";
    };
    reader.readAsDataURL(file);
}
