var mi_mediaAudioGrabar;
var mi_mediaAudioReproducir;
//var src = "myrecording.wav";
var myFileName = "myfile001.wav";
//var Nuevo="sound.wav"
var sFichero;

function recordAudioInicio() {
    try{
        document.getElementById('audio_position').innerHTML = "recordAudioInicio";

        mi_mediaAudioGrabar = new Media(myFileName,onSuccessAudio,onErrorAudio);

        // Record audio
        mi_mediaAudioGrabar.startRecord();
    }
    catch (ex){
        alert("recordAudioInicio "+ ex.message)
    }
}

function recordAudioFin() {
    try{
        document.getElementById('audio_position').innerHTML = "recordAudioFin";
        mi_mediaAudioGrabar.stopRecord();
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, ConvertirFicheroAudioToBase64, LeerFicheroAudioError1);
    }
    catch (ex){
        alert("recordAudioFin "+ ex.message)

    }
}


/*************************** REPRODUCIR AUDIO ***************************/

function gotFS(fileSystem) {
    fileSystem.root.getFile(myFileName, {create: true, exclusive: false}, gotFileEntry, onError);
}
function onError(error) {
    alert('gotFS  \n code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
}

function gotFileEntry(fileEntry) {

    //var fileUri = fileEntry.toURI();
    //var scr = fileEntry.toURI();
    //
    //my_media = new Media(myFileName, onSuccess('Play'), onError);
    //
    //// Play audio
    //my_media.play();
    //
    //// Update my_media position every second
    //if (mediaTimer == null) {
    //    mediaTimer = setInterval(function() {
    //        // get my_media position
    //        my_media.getCurrentPosition(
    //            // success callback
    //            function(position) {
    //                if (position > -1) {
    //                    var iPos = parseInt(position);
    //                    if (iPos < 10) {
    //                        setAudioPosition("0:0" + (iPos), 0);
    //                    }
    //                    else
    //                    {
    //                        setAudioPosition("0:" + (iPos), 0);
    //                    }
    //                    if (iPos==0){
    //                        setAudioPosition("", 0);
    //                        document.getElementById('playAudio_Push').src="img/play.png";
    //                    }
    //                    else{
    //                        document.getElementById('playAudio_Push').src="img/stop.png";
    //                    }
    //                }
    //            },
    //            // error callback
    //            function(e) {
    //                alert("Error getting pos=" + e);
    //                setAudioPosition("Error: " + e, 1);
    //            }
    //        );
    //    }, setInt * 100);
    //}
}

function PlayAudioInicio() {
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, onError);
    //fileSystem.root.getFile(myFileName, {create: true, exclusive: false}, gotFileEntry(), onError);
    try {
        document.getElementById('audio_position').innerHTML = "PlayAudioInicio";
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, ConvertirBase64ToFicheroAudio, EscribirFicheroAudioError);


        var file = new Parse.File("sound.wav", { base64: sFichero });
        file.save().then(function() {
           alert("bien parse");
        }, function(error) {
            alert("mal parse "+error.message);
            // The file either could not be read, or could not be saved to Parse.
        });

        //var sFich="data:audio/mpeg;base64," + sFichero;
        //var writer = new FileWriter();
        //writer.write(sFich);

        mi_mediaAudioReproducir = new Media("sound.wav", onSuccessAudio, onErrorAudio);

        // Play audio
        mi_mediaAudioReproducir.play();
    }
    catch (ex) {
        alert("PlayAudioInicio "+ ex.message)
    }
}

function PlayAudioFin() {
    try{
        document.getElementById('audio_position').innerHTML = "PlayAudioFin";
        mi_mediaAudioReproducir.stop();
    }
    catch (ex){
        alert("PlayAudioFin"+ ex.message)
    }
}

function onSuccessAudio() {
    alert('onSuccessAudio');
}

function onErrorAudio(error) {
    alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
}

// Set audio position
//
function setAudioPosition(position) {
//    document.getElementById('audio_position').innerHTML = position;
}


function ConvertirFicheroAudioToBase64(fileSystem) {
    fileSystem.root.getFile(myFileName, null, LeerFicheroAudio, LeerFicheroAudioError2);
}
function LeerFicheroAudio(fileEntry) {
    fileEntry.file(LeerFicheroAudioOK, LeerFicheroAudioError);
}
// the file is successfully retreived
function LeerFicheroAudioOK(file){
    TransformarFicheroAudioToBase64(file);
}
function LeerFicheroAudioError1(error) {
    sFichero='';
    alert('FIN AUDIO ERROR \n code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
}
function LeerFicheroAudioError2(error) {
    sFichero='';
    alert('CONVERTIR AUDIO ERROR  \n code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
}
// turn the file into a base64 encoded string, and update the var base to this value.
function TransformarFicheroAudioToBase64(file) {
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        alert(evt.target.result);
        sFichero = evt.target.result;
        sFichero  =   sFichero.toString().substring(sFichero.toString().indexOf(",")+1);
    };
    reader.readAsDataURL(file);
}



function EscribirFicheroAudioError(error) {
    alert(error.message,"error");
}
function ConvertirBase64ToFicheroAudio(fileSystem) {
    fileSystem.root.getFile(Nuevo, null, EscribirFicheroAudio, EscribirFicheroAudioError);
}

