appHistorial = (function () {
    var cargarHistorial = function () {
        if (sessionStorage.getItem('email') == null) {
            alert("Permiso denegado, debe logearse primero.")
            location.href = "/loginDriver.html"
        } else {
            apiclient.consultarHistorial(sessionStorage.getItem('email'), sessionStorage.getItem('token'), appHistorial.generarTabla)
        }
    }
    var generarTabla = function (ft) {


        ft.map(function (f) {
            console.log(f)
            $('#cuerpo')
                .append(
                    `<tr>
					<td>`+ f.idService + `</td>
					<td>`+ f.app.name + `</td>` +
                    `<td>` + f.customer.userName + `</td>` +
                    `<td>` + f.destino + `</td>` +
                    `<td>` + f.price + `</td>` +
                    `</tr>`
                );

        });
    }
    return {
        cargarHistorial: cargarHistorial,
        generarTabla: generarTabla
    }
})();