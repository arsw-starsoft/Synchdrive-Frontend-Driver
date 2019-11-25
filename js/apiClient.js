apiclient = (function () {
	return {
		loginUser: function (datos, succ, err) {
			$.ajax({
				type: "POST",
				url: "https://synchdrive.herokuapp.com/authenticate",
				contentType: "application/json; charset=utf-8", //importante para el back
				dataType: 'json',
				data: datos,
				success: succ,
				error: err
			});
		},
		/*
			FUNCIONES DE REGISTRO
		*/

		registroConductor: function (datos, succ, err) {
			$.ajax({
				method: "POST",
				contentType: "application/json",
				url: "https://synchdrive.herokuapp.com/drivers",
				data: datos,
				success: succ,
				error: err
			});
		},
		consultarDriver: function (driver, token, callback) {
			console.log(driver)
			$.ajax({
				method: "GET",
				contentType: "application/json",
				url: "https://synchdrive.herokuapp.com/drivers/" + driver,
				headers: { "Authorization": token },
				success: function (respuesta) {
					callback(respuesta)
				},
				error: function () {
					console.log("No se ha podido obtener la información");
				}
			});
		},
		updateDriver:function (datos, succ, err) {
			console.log(datos)
			console.log(sessionStorage.getItem('email'))
			console.log(sessionStorage.getItem('token'))
			$.ajax({
				method: "PUT",
				contentType: "application/json; charset=utf-8", //importante para el backs
				data: datos,
				url: "https://synchdrive.herokuapp.com/drivers/" + sessionStorage.getItem('email'),
				headers: { "Authorization": sessionStorage.getItem('token') },
				success: succ,
				error: err
			});
		},
		aceptarService:function (datos,app,succ, err) {
			console.log(datos)
			console.log(sessionStorage.getItem('email'))
			console.log(sessionStorage.getItem('token'))
			$.ajax({
				method: "PUT",
				contentType: "application/json; charset=utf-8", //importante para el backs
				data: datos,
				url: "https://synchdrive.herokuapp.com/" + sessionStorage.getItem('email')+"/"+app,
				headers: { "Authorization": sessionStorage.getItem('token') },
				success: succ,
				error: err
			});
		},
		consultarHistorial: function (user, token, callback) {
			console.log(user)
			console.log(token)
			console.log(user)
			$.ajax({
				method: "GET",
				contentType: "application/json",
				url: "https://synchdrive.herokuapp.com/servicios/"+user+"/recordDriver",
				headers: { "Authorization": token },
				success: function (respuesta) {
					callback(respuesta)
				},
				error: function () {
					console.log("No se ha podido obtener la información");
				}
			});
		},
		

	}
})();