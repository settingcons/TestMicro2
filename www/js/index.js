var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        deviceReady();
    }
};

function deviceReady() {
    try {

        window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, gotFS, onErrorDevideReady);

        //window.requestFileSystem(1, 0, function(fileSystem){
        //}, function(e){
            // 'e' is an object, {code: 'Class not found'}
            //alert('Error accessing local file system');
        //});
    }
    catch (ex) {
        alert("deviceReady error: "+ex.message);
    }
}

function onErrorDevideReady(error) {
    alert('onErrorDevideReady  \n code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
}

//var requestFileSystem = function(type, size, successCallback, errorCallback) {
//    argscheck.checkArgs('nnFF', 'requestFileSystem', arguments);
//    var fail = function(code) {
//        errorCallback && errorCallback(new FileError(code));
//    };
//
//    if (type < 0) {
//        fail(FileError.SYNTAX_ERR);
//    } else {
//        // if successful, return a FileSystem object
//        var success = function(file_system) {
//            if (file_system) {
//                if (successCallback) {
//                    // grab the name and root from the file system object
//                    var result = new FileSystem(file_system.name, file_system.root);
//                    successCallback(result);
//                }
//            }
//            else {
//                // no FileSystem object returned
//                fail(FileError.NOT_FOUND_ERR);
//            }
//        };
//        // The error happens in exec()
//        exec(success, fail, "File", "requestFileSystem", [type, size]);
//    }
//};
