appService = (function () {

    var stompClient = null;
    var webSocketActive = [];
    var listApps = []
    //Conductor se conecta a el stomp, con la lista de apps que tiene el conductor
    var initConexion = function () {
        apiclient.consultarDriver(sessionStorage.getItem('email'), sessionStorage.getItem('token'), connectAndSubscribeDriver)
        appService.BuscandoServicio();
    }
    var BuscandoServicio = function () {
        $("#BuscarServicio").html('<input type="button" value="Close Service" class="btn float-none login_btn" onclick="appService.cancelarBusqueda()">')
        var list = $("input[type=radio]");
        list.map(function (f) {
            console.log('"#' + list[f].id + '"');
            $('#' + list[f].id).prop('disabled', true);
        });
        list = $("input[type=checkbox]");
        list.map(function (f) {
            console.log('"#' + list[f].id + '"');
            $('#' + list[f].id).prop('disabled', true);
        });
        if ($("#NearbyDestination").is(':checked')) {
            $("#Destination").prop('disabled', true)
        }
    }
    var cargarFiltros = function () {
        var elementos = ' <input type="radio" name="NServices" id="OneDriver">' +
            '<label for="OneDriver">One Driver</label>' +
            '<input type="radio" name="NServices" id="TwoDriver">' +
            '<label for="TwoDriver">Two Driver</label>'
        $("#Tservices").html(elementos)
    }
    var cancelarBusqueda = function () {
        stompClient = null;
        var list = $("input[type=radio]");
        list.map(function (f) {
            console.log('"#' + list[f].id + '"');
            $('#' + list[f].id).prop('disabled', false);
        });
        if ($("#NearbyDestination").is(':checked')) {
            $("#Destination").prop('disabled', false)
        }
        list = $("input[type=checkbox]");
        list.map(function (f) {
            console.log('"#' + list[f].id + '"');
            $('#' + list[f].id).prop('disabled', false);
        });
        $("#BuscarServicio").html('<input type="button" value="Activate Service" class="btn float-none login_btn" onclick="appService.initConexion()">')
    }
    var connectAndSubscribeDriver = function (funcion) {
        listApps = [];
        console.log(funcion)
        funcion.apps.map(function (f) {
            ch = document.getElementById(f.name);
            console.log(ch)
            if (ch.checked == 1) {
                listApps.push(f.name)
            }
        });

        var socket = new SockJS("https://synchdrive.herokuapp.com/stompendpoint");
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log("Connected: " + frame);
            listApps.forEach(function (app) {
                console.log("Subscribing to " + app.toLowerCase());
                stompClient.subscribe("/topic/services." + app.toLowerCase(), function (eventBody) {
                    var object = JSON.parse(eventBody.body);
                    serviciosActivos = object;

                    console.log(object)
                    object.forEach(function (s) {
                        appService.webSocketActive.push(s);
                    });
                    appService.mostrarServicios();
                })

            });
            //Esta pendiente de los servicios cancelados para eliminarlos
            stompClient.subscribe("/topic/canceled", function (eventBody) {
                var object = JSON.parse(eventBody.body);
                console.log("Canceled... " + object);
            });

            //Está pendiente de los servicios acceptados para eliminarlos
            stompClient.subscribe("/topic/accepted", function (eventBody) {
                var object = JSON.parse(eventBody.body);

                appService.webSocketActive = [];
                object.forEach(function (obj) {
                    appService.webSocketActive.push(obj);
                })
                appService.mostrarServicios();

            });
        });

    };

    var mostrarServicios = function () {
        console.log("--------------------------------")
        console.log(appService.webSocketActive)
        $("#serviciosActivos").html("");
        var elemento = '<thead><tr><th scope="col"><label for="">Service Requests:</label></th></tr><thead><tbody>';
        appService.webSocketActive.map(function (f) {
            listApps.map(function (fun) {
                if (f.app.name.toLowerCase() == fun) {
                    console.log(f)
                    elemento += '<tr><td >' +
                        "Email: " + f.customer.email + '<br>' +
                        "User Name: " + f.customer.userName + '<br>' +
                        "Price: " + f.price + '<br>' +
                        "Duration; " + f.duration + '<br>' +
                        '<input type="button" value="Accept Service"  onclick="appService.aceptarService(' + f.idService + ')"></input><br>' +
                        '</td></tr>';
                }
            });

        });
        elemento += '</tbody>';


        $("#serviciosActivos").html(elemento);
    };

    var aceptarService = function (id) {
        appService.webSocketActive.map(function (f) {
            if (f.idService == id) { 
                appEnServicio.acceptService(f, publishAcceptService)
            }
        });
        //location.href = "/EnServicio.html";

    }
    var publishAcceptService = function (service) {
        var list = appService.webSocketActive.filter(function (serv) {
            return serv.idPeticion !== service.idPeticion;
        });
        console.log(appService.webSocketActive)
        stompClient.send("/topic/accepted", {}, JSON.stringify(list));
        
    };
    /**var acceptService = function (service, callback) {
        console.log("Accepting... " + service);
        $.ajax({
            method: "PUT",
            contentType: "application/json",
            url: "https://synchdrive.herokuapp.com/servicios/" + sessionStorage.getItem('email') + "/" + service.app.name,
            data: JSON.stringify(service),
            headers: { "Authorization": sessionStorage.getItem('token') },
            success: function () {
                location.href="/enServicio.html"
                callback(service);

            },
            error: function () {
                alert("ERROR ACCEPTING");
            }
        });
    };*/
    return {
        connectAndSubscribeDriver: connectAndSubscribeDriver,
        initConexion: initConexion,
        BuscandoServicio: BuscandoServicio,
        cancelarBusqueda: cancelarBusqueda,
        cargarFiltros: cargarFiltros,
        mostrarServicios: mostrarServicios,
        webSocketActive: webSocketActive,
        publishAcceptService: publishAcceptService,
        aceptarService: aceptarService
    }

})();