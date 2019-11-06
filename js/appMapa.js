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
            elementos += '<input type="checkbox" name="checkbox' + cont + '"id="' + f.name + '"onclick="">' +
                '<label for="' + f.name + '">' + f.name + '</label>';
            cont += 1;

        });
        $("#aplicaciones").html(elementos)
        menuNservices()
    };
    var menuNservices = function () {
        var elementos = "";

        elementos = ' <input type="radio" name="NServices" id="OneDriver">' +
            '<label for="OneDriver">One Driver</label>' +
            '<input type="radio" name="NServices" id="TwoDriver">' +
            '<label for="TwoDriver">Two Driver</label>' +
            ' <input type="radio" name="NServices" id="ThreeDriver">' +
            ' <label for="ThreeDriver">Three Driver</label>';
        $("#nservices").html(elementos)
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
                return navigator.geolocation.getCurrentPosition(cordenadaSuccess, cordenadasError, options);
            }
        },
        menu:menu,
        menuNservices:menuNservices

    }

})();
