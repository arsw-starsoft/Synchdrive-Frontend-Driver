appService = (function () {

    var stompClient = null;
    var serviciosActivos=[];
    //Conductor se conecta a el stomp, con la lista de apps que tiene el conductor
    var initConexion=function(){
        apiclient.consultarDriver(sessionStorage.getItem('email'),sessionStorage.getItem('token'),connectAndSubscribeDriver)
        appService.BuscandoServicio();
    }
    var BuscandoServicio=function(){
        $("#BuscarServicio").html('<input type="button" value="Close Service" class="btn float-none login_btn" onclick="appService.cancelarBusqueda()">')
        var list=$("input[type=radio]");
        list.map(function(f){
            console.log( '"#'+list[f].id+'"');
            $('#'+list[f].id).prop('disabled', true);
        });
        list=$("input[type=checkbox]");
        list.map(function(f){
            console.log( '"#'+list[f].id+'"');
            $('#'+list[f].id).prop('disabled', true);
        });
        if($("#NearbyDestination").is(':checked')){
            $("#Destination").prop('disabled', true)    
        }
    }
    var cargarFiltros=function(){
        var elementos= ' <input type="radio" name="NServices" id="OneDriver">' +
        '<label for="OneDriver">One Driver</label>' +
        '<input type="radio" name="NServices" id="TwoDriver">' +
        '<label for="TwoDriver">Two Driver</label>'
        $("#Tservices").html(elementos)
    }
    var cancelarBusqueda=function(){
        stompClient=null;
        var list=$("input[type=radio]");
        list.map(function(f){
            console.log( '"#'+list[f].id+'"');
            $('#'+list[f].id).prop('disabled', false);
        });
        if($("#NearbyDestination").is(':checked')){
            $("#Destination").prop('disabled', false)    
        }
        list=$("input[type=checkbox]");
        list.map(function(f){
            console.log( '"#'+list[f].id+'"');
            $('#'+list[f].id).prop('disabled', false);
        });
        $("#BuscarServicio").html('<input type="button" value="Activate Service" class="btn float-none login_btn" onclick="appService.initConexion()">')
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
                appService.mostrarServicios(object);
            });
        });
    };
    var mostrarServicios=function(serv){
        var elemento='<thead><tr><th scope="col"><label for="">Service Requests:</label></th></tr><thead><tbody>';
        if(serviciosActivos.length>9){
            serviciosActivos.pop()
            serviciosActivos.unshift(serv)
        }else{
            serviciosActivos.unshift(serv)
        }
        serviciosActivos.map(function(f){
            elemento+= '<tr><td >'+
            "Email: "+f.customer.email+'<br>'+
            "User Name: "+f.customer.userName+'<br>'+
            "Price: "+f.price+'<br>'+
            "Duration; "+f.duration+'<br>'+
            '<input type="button" value="Accept Service" ></input><br>'+
            '</td></tr>';
        });
        elemento+='</tbody>';
        
       
        $("#serviciosActivos").html(elemento);
    }
    return {
        connectAndSubscribeDriver: connectAndSubscribeDriver,
        initConexion:initConexion,
        BuscandoServicio:BuscandoServicio,
        cancelarBusqueda:cancelarBusqueda,
        cargarFiltros:cargarFiltros, 
        mostrarServicios:mostrarServicios
    }

})();