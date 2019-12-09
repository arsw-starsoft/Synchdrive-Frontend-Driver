appMapa = (function () {

    var cordenadaSuccess = function (position) {
        var coordenadas = position.coords;
        console.log('Tu posición actual es:');
        console.log('Latitud : ' + coordenadas.latitude);
        console.log('Longitud: ' + coordenadas.longitude);
        console.log('Más o menos ' + coordenadas.accuracy + ' metros.');
        L.marker([coordenadas.latitude, coordenadas.longitude]).addTo(map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
            .openPopup();
    };

    var cordenadasError = function (error) {
        console.warn('ERROR(' + error.code + '): ' + error.message);
    };
    var menu = function (funcion) {
        console.log("funcional");
        var cont = 1;
        var elementos = "";
       
        funcion.apps.map(function (f) {
            console.log(f)
            elementos += '<input type="checkbox" name="checkbox' + cont + '"id="' + f.name + '"onclick="" checked>' +
                '<label for="' + f.name + '">' + f.name + '</label>';
            cont += 1;

        });
        $("#aplicaciones").html(elementos)
        menuNservices()
    };
    var menuNservices = function () {
        var elementos = "";

        elementos = ' <input type="radio" name="TServices" id="MoreExpensiveCareers" onclick="appMapa.cargarFiltroDestino()">' +
            '<label for="MoreExpensiveCareers">More Expensive Careers</label>' +
            '<input type="radio" name="TServices" id="NearbyDestination" onclick="appMapa.cargarFiltroDestino()">' +
            '<label for="NearbyDestination">Nearby Destination</label>'+
            '<input type="radio" name="TServices" id="AllServices" onclick="appMapa.cargarFiltroDestino()" checked>' +
            '<label for="AllServices">All Services</label>';
        $("#Tservices").html(elementos)
        $("#NearbyDestination").prop('disabled', true)
    }
    var cargarFiltroDestino=function(){
        var elemento=""
        if($("#NearbyDestination").is(':checked')){
            elemento='<label>Destination:</label>  <input id="Destination" type="text">';
        }
        $("#Ldestino").html(elemento)
        $("#NearbyDestination").prop('disabled', true)
    }
    return {
        getCordenadas: function (name) {
            if (sessionStorage.getItem('email') == null) {
                alert("Permiso denegado, debe logearse primero.")
                location.href = "/loginDriver.html"
            } else {
                var options = {
                    enableHighAccuracy: true,
                    timeout: 6000,
                    maximumAge: 0
                };
                apiclient.consultarDriver(sessionStorage.getItem('email'),sessionStorage.getItem('token'),menu)
                //appService.cargarFiltros()
                return navigator.geolocation.getCurrentPosition(cordenadaSuccess, cordenadasError, options);
            }
        },
        menu:menu,
        menuNservices:menuNservices,
        cargarFiltroDestino:cargarFiltroDestino

    }

})();
