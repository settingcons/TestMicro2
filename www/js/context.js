
var sound;
var source;


var audio = new Audio();
audio.loop = false;
audio.autoplay = false;
var v_ficheroREC = "myfile001.wav";

//window.addEventListener("load", initMp3Player, false);
/*
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
*/

//v_fichero = "//localhost/temporary/var/mobile/Applications/" + deviceID + "/Documents" + v_fichero;

function ReproducirVarios(idx){
    var deviceID = device.uuid;
    switch(idx) {
        case 0:
            v_fichero = ObtenerFicheroAudio();
            loadSound('Documents' + v_fichero);
            break;
        case 1:
            v_fichero = ObtenerFicheroAudio();
            loadSound('Documents/Inbox' + v_fichero);
            break;
        case 2:
            v_fichero = ObtenerFicheroAudio();
            loadSound('Library' + v_fichero);
            break;
        case 3:
            v_fichero = ObtenerFicheroAudio();
            loadSound('/tmp' + v_fichero);
            break;
    }
    audio.play();

}

function Reproducir0(){
    //v_fichero = "audio/1ra-e.mp3";
    try{
        //v_fichero = _mediaAudioFicheroIOS; //ObtenerFicheroAudio();
        v_fichero = ObtenerFicheroAudio();
        //loadSound('tmp' + v_fichero);

        //para iOs
        //https://github.com/apache/cordova-plugin-file/blob/master/doc/es/index.md
        //      / var/mobile/Applications/< UUID > /
        // Sobre estructura de aplicaciones iOS: https://developer.apple.com/library/ios/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html
        // otra url: https://developer.apple.com/library/ios/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/AccessingFilesandDirectories/AccessingFilesandDirectories.html
        try{
            var deviceID = device.uuid;
            var sPath = '';
            //iOS v7 e inferior
            //sPath = 'var/mobile/Applications/' + deviceID +  v_fichero;
            //iOS v8
            sPath = 'var/mobile/Containers/' + deviceID +  '/tmp' + v_fichero;
            //loadSound(sPath);
            loadSound(v_fichero);
        }
        catch (ex){
            alert('Reproducir0: '+ex.message);
        }

    }
    catch (ex9){
        try{
            alert('Library/Cache' + v_fichero);
            loadSound('Library/Cache' + v_fichero);
        }
        catch (ex9){alert('Reproducir0: '+ex9.message);}

    }
    /*
    try{
        playSound(_inciAudioFichero);
        alert('_inciAudioFichero');
    }
    catch (ex){
        playSound(_inciAudioFichero_complet);
        alert('_inciAudioFichero_complet');
    }
*/

}


function Reproducir1(){
    //var v_fichero = _mediaAudioFicheroIOS;
    //v_fichero = "audio/1ra-e.mp3";
    //loadSound(v_fichero);

    mi_mediaAudioReproducir = new Media(myFileNameURI, onSuccessAudio, onErrorAudioPlay);
    // Play audio
    mi_mediaAudioReproducir.play();

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
    var source = context.createBufferSource();
    source.buffer = context.createBuffer(request.response, false);
    mySource = source;
    source.start(0);
}

function loadSound_2(url) {
    try
    {
        // Create a instance of AudioContext interface
        //window.AudioContext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
        //context = new AudioContext();

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
        alert(url);
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
        alert(url);
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        alert('loadSound1');

        try {
            alert('Primer Try');
            request.onload = function() {
                alert('loadSound2');
                context.decodeAudioData(request.response, function(buffer) {
                    alert('ok');
                    sound = buffer;
                    playSound(sound);
                    alert('Después playSound');
                },ErrorLoad);
            }
            alert('Después request.onload Primer Try');
        }
        catch (ex1){alert('loadSound: '+ex1.message);}
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

        alert('Antes del request.Send');
        request.send();
        alert('Después del request.Send');
    }
    catch (ex){alert('loadSound: '+ex.message);}
}

function loadSound_OLD(url) {
    try {
        //alert(url);
        var request = new XMLHttpRequest();
        alert(url);
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';


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
    try{
        alert('entra playSound');
        source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(context.destination);
        alert('Antes start');
        if(esIOS()){
            alert('Antes noteOn(0)');
            source.noteOn(0);
            alert('Después noteOn(0)');
        }
        else{
            alert('Antes start(0)');
            source.start(0);
            alert('Después start(0)');
        }

        alert('Después start (dentro Try)');

    }

    catch (ex){alert('loadSound: '+ex.message);}
}

function parar(){
    source.stop();
}


/*************/
/*   OLD    */
/*************/
/*
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
*/

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
        var v_mensaje = "s'està gravant al teu missatge de veu...";
        var v_titulo = "Gravació";
        var v_botones = "Finalitzar,Descartar";

        var v_imagen = document.getElementById('imgAudioPlay');
        v_imagen.src = "images/play_gray.png";

        //Iniciar Grabación
        var v_fichero=ObtenerFicheroAudio();
        _mediaAudio = new Media(v_fichero,onSuccessAudio,onErrorAudio);
        _mediaAudio.startRecord();

        if(navigator.notification && navigator.notification.confirm){
            navigator.notification.confirm(v_mensaje,AudioGrabacion,v_titulo,v_botones);
        }
        else
        {
            var v_retorno = confirm(v_mensaje);
            if (v_retorno){
                AudioGrabacion(1);
            }
            else {
                AudioGrabacion(2);
            }
        }
    }
    catch (ex){mensaje(ex.message,"error");}
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
    //fileEntry investigar la propiedades --> fileSystem.root.getFile
    try{
        alert('fileEntry: ' + fileEntry);
/*        alert('toURL: ' + fileEntry.toURL);
        alert('fullPath: ' + fileEntry.fullPath);
        alert('toURI: ' + fileEntry.toURI);
        alert('getParent: ' + fileEntry.getParent);
        alert('file: ' + fileEntry.file);
 */
    }
    catch (ex9){alert('CrearFicheroAudioIOSCorrecto: '+ex9.message);}
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
        _inciAudioFichero_complet = _inciAudioFichero;
        _inciAudioFichero  =   _inciAudioFichero.toString().substring(_inciAudioFichero.toString().indexOf(",")+1);
        var imagen = document.getElementById('imgAudioPlay');
        imagen.src = "images/play_red.png";
    };
    reader.readAsDataURL(file);
}
