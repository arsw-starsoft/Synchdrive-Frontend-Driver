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
                return navigator.geolocation.getCurrentPosition(cordenadaSuccess, cordenadasError, options);
            }
        }


    }

})();
