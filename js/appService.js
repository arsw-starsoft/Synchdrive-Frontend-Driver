appService = (function () {

    var stompClient = null;
    //Conductor se conecta a el stomp, con la lista de apps que tiene el conductor
    var initConexion=function(){
        apiclient.consultarDriver(sessionStorage.getItem('email'),sessionStorage.getItem('token'),connectAndSubscribeDriver)
    }
    var connectAndSubscribeDriver = function (funcion) {
        var listApps=[];
        console.log(funcion)
        funcion.apps.map(function (f) {
            ch = document.getElementById(f.name);
            console.log(ch)
            if (ch.checked == 1) {
                listApps.push(f.name)
            }
        });
        
        console.log("Connecting to WS...");
        listApps.sort(); //Ordenar para el back message  uber didi beat
        var stringMessage = "";
        listApps.forEach(function (app) {
            stringMessage += "." + app.toLowerCase();
        });
        console.log(stringMessage);
        var socket = new SockJS("https://synchdrive.herokuapp.com/stompendpoint");
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log("Connected: " + frame);
            stompClient.subscribe("/topic/services" + stringMessage, function (eventBody) {
                var object = JSON.parse(eventBody.body);
                console.log(object);
            });
        });
    };

    
    return {
        connectAndSubscribeDriver: connectAndSubscribeDriver,
        initConexion:initConexion
    }

})();