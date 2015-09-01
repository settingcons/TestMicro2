var context;
var sound;
var source;
function deviceReady() {
    try {
        //window.AudioContext = window.AudioContext || window.webkitAudioContext;
        //context = new AudioContext();

        if(esIOS()){
            alert('esIOS: deviceReady');
            context = new window.webkitAudioContext;
        }
        else{
            context = new window.AudioContext || window.webkitAudioContext;
        }

    }
    catch (ex){alert('deviceReady: '+ex.message);}
}


function Reproducir1(){
    var v_fichero = _mediaAudioFicheroIOS;
    loadSound(v_fichero);
}

function Reproducir(){
    alert('Reproducir1');
    var v_fichero = ObtenerFicheroAudio();
    loadSound(v_fichero);
}


var mySource;
function bufferSoundiOS(event) {
    alert('Entra bufferSoundiOS');
    var request = event.target;
    alert('1 bufferSoundiOS');
    var source = context.createBufferSource();
    alert('2 bufferSoundiOS');
    source.buffer = context.createBuffer(request.response, false);
    alert('3 bufferSoundiOS');
    mySource = source;
    alert('4 bufferSoundiOS');
    mySource.start(0);
    alert('5 bufferSoundiOS');
}

function loadSound(url) {
    try {
        alert(url);
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        alert('loadSound1');

        if(esIOS()){
            alert('esIOS: loadSound');
            request.addEventListener('load', bufferSoundiOS, false);
        }
        else{
            request.onload = function() {
                alert('loadSound2');
                context.decodeAudioData(request.response, function(buffer) {
                    alert('ok');
                    sound = buffer;
                    playSound(sound);
                    alert('Después playSound');
                },ErrorLoad);
            }
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
