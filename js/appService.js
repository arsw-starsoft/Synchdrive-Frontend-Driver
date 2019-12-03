appService = (function () {

    var stompClient = null;
    var webSocketActive = [];
    var listApps = [];
    var enServicio = false;
    //Conductor se conecta a el stomp, con la lista de apps que tiene el conductor
    var initConexion = function () {
        apiclient.consultarDriver(sessionStorage.getItem('email'), sessionStorage.getItem('token'), appService.verificar)

    }
    var verificar = function (f) {
        var num = 0;
        console.log(appMapa.apps)
        f.apps.map(function (f) {
            ch = document.getElementById(f.name);
            console.log(ch)
            if (ch.checked == 1) {
                num += 1;
                console.log(num)
            }
        });
        if (num < 1) {
            alert(" please select an application")
        } else {
            apiclient.consultarDriver(sessionStorage.getItem('email'), sessionStorage.getItem('token'), appService.connectAndSubscribeDriver)
            appService.BuscandoServicio();
        }
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
        appService.webSocketActive = [];
        appService.mostrarServicios();
        appService.stompClient = null;
        appService.enServicio = false;
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
        appService.enServicio = true;
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
                        condicional = 0;
                        appService.webSocketActive.map(function (f) {
                            if (f.idService == s.idService) {
                                condicional += 1
                            }
                        })
                        if (condicional == 0) {
                            appService.webSocketActive.push(s);
                        }
                    });
                    appService.mostrarServicios();
                })
            });
            //Esta pendiente de los servicios cancelados para eliminarlos
            stompClient.subscribe("/topic/canceled", function (eventBody) {
                var object = JSON.parse(eventBody.body);
                console.log(object)
                var list = appService.webSocketActive.filter(function (serv) {
                    if (serv.customer.email !== object.email) {
                        return true;
                    } else {
                        return false;
                    }
                });

                appService.webSocketActive = [];
                list.forEach(function (obj) {
                    appService.webSocketActive.push(obj);
                })
                appService.mostrarServicios();

            });

            //Está pendiente de los servicios acceptados para eliminarlos
            stompClient.subscribe("/topic/accepted", function (eventBody) {
                var object = JSON.parse(eventBody.body);
                console.log("DIOSSSSSSSSSSSSSSSSSSSSSSSS")
                console.log(object)
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
        var servicioMasCaro = null;
        console.log(appService.webSocketActive)
        if ($('#MoreExpensiveCareers').is(':checked') && appService.webSocketActive.length > 0) {
            servicioMasCaro = appService.webSocketActive[0];
            for (var i = 1; i < appService.webSocketActive.length; i++) {
                if (appService.webSocketActive[i].price >= servicioMasCaro.price) {
                    servicioMasCaro = appService.webSocketActive[i]
                }
            }
            f = servicioMasCaro;
            elemento += '<tr><td >' +
                "Email: " + f.customer.email + '<br>' +
                "User Name: " + f.customer.userName + '<br>' +
                "Price: " + f.price + '<br>' +
                "Duration; " + f.duration + '<br>' +
                '<input type="button" value="Accept Service"  onclick="appService.aceptarService(' + f.idService + ')"></input><br>' +
                '</td></tr>';

        } else {

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


        }
        if (appService.enServicio) {
            elemento += '</tbody>';
            $("#serviciosActivos").html(elemento);
        }else{
            $("#serviciosActivos").html("");
        }

    };

    var aceptarService = function (id) {
        appService.webSocketActive.map(function (f) {
            if (f.idService == id) {
                appEnServicio.acceptService(f, appService.publishAcceptService)
            }
        });
        //location.href = "/EnServicio.html";

    }
    var publishAcceptService = function (service) {
        //console.log(service)
        var list = appService.webSocketActive.filter(function (serv) {
            if (service.customer.email !== serv.customer.email) {
                return true;
            } else {
                return serv.idPeticion !== service.idPeticion;
            }
            /**console.log(service.customer.email)
            console.log(serv.customer.email)
            console.log(serv.idPeticion !== service.idPeticion && service.customer.email!==serv.customer.email)
            console.log(serv)
            return serv.idPeticion !== service.idPeticion && service.customer.email!==serv.customer.email;*/
        });
        console.log("----------------------------------------------asas-------")
        console.log(list)
        console.log(appService.webSocketActive)
        //appService.webSocketActive=list;
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
        aceptarService: aceptarService,
        verificar: verificar,
        stompClient: stompClient,
        enServicio: enServicio
    }

})();