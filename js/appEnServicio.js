appEnServicio = (function () {
   
    var generarInformacion=function(fun){
        $("#informacion").html("")
        service=null
        fun.map(function(f){
            if(f.idService==sessionStorage.getItem("IdService")){
                service=f;
            }
        })
        console.log(service)
        var elemento='<label for="Name" style="color: aliceblue; top:20%; left: 43%;position: absolute; font-weight: bold">'+
        "Customer Name: "+service.customer.userName+ '<br></br>'+
        "Destination: "+service.destino+'<br></br>'+
        "Price: "+service.price+'</label>'
        $("#informacion").html(elemento)
    }
    var cargarInformacion=function(){
        apiclient.consultarHistorial(sessionStorage.getItem('email'), sessionStorage.getItem('token'),appEnServicio.generarInformacion)
    }
    return {
        acceptService: function (service, callback) {
            console.log("Accepting... " + service);
            $.ajax({
                method: "PUT",
                contentType: "application/json",
                url: "https://synchdrive.herokuapp.com/servicios/" + sessionStorage.getItem('email') + "/" + service.app.name,
                data: JSON.stringify(service),
                headers: { "Authorization": sessionStorage.getItem('token') },
                success: function () {
                    callback(service);
                },
                error: function () {
                    alert("ERROR ACCEPTING");
                }
            });

        },
        cargarInformacion:cargarInformacion,
        generarInformacion:generarInformacion,
        
    }
})();