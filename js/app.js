  

app = (function () {
    // PROMESAS DEL REGISTRO
    var email; 
    var onSucessRegistro = function (data) {
        alert("Ha sido registrado exitosamente");
        location.href = "loginDriver.html";
    }
    var onErrorUpdate = function (data) {
        alert("No se pudo realizar la actualizacion  correctamente");
        location.href = "perfilDriver.html";
    }
    var onSucessUpdate = function (data) {
        alert("Ha sido actualizado exitosamente");
        location.href = "perfilDriver.html";
    }
    
    var onSucessLoing = function (data) {
        sessionStorage.setItem('token',"Bearer "+data["token"])
        sessionStorage.setItem('email',email)
        console.log(sessionStorage.getItem('token'))
        apiclient.consultarDriver(sessionStorage.getItem('email'),sessionStorage.getItem('token'))
        alert("Ha sido Login exitosamente");
        location.href = "perfilDriver.html";
       
    }
    var LogOut=function (data) {
        sessionStorage.clear('token');
        sessionStorage.clear('email');
        location.href = "loginDriver.html";
    }
    var cargarDatos= function (data) {
        if (sessionStorage.getItem('email') == null ){
            alert("Permiso denegado, debe logearse primero.")
            location.href = "/loginDriver.html"
        }else{
            apiclient.consultarDriver(sessionStorage.getItem('email'),sessionStorage.getItem('token'),actualizarPerfil)
        }
       
    }
    var actualizarPerfil=function(funcion){
        console.log(funcion)
        chk=funcion["apps"]
        for(i=0;i<chk.length;i++){
            ch=document.getElementById(chk[i]["name"]);
            ch.checked=1
        }
        $("#UserName").val(funcion["userName"]);
        $("#Email").val(funcion["email"]);
        $("#FirstName").val(funcion["firstName"]);
        $("#LastName").val(funcion["lastName"]);
        $("#CellPhone").val(funcion["cellPhone"]);
        $("#telefono").text(funcion["cellPhone"]);
        $("#nombre").text(funcion["userName"]);
        $("#correo").text(funcion["email"]);
    }
    var onErrorLogin = function (data) {
        alert("No se pudo realizar el login correctamente");
        
    }

    var onErrorRegistro = function (data) {
        alert("No se pudo realizar el registro correctamente");
        location.href = "";
    }
    var updateDatos = function (data) {
        list= []
        chk=document.getElementsByName('Tcuenta');
        for(i=0;i<chk.length;i++){
            if(chk[i].checked){
                elemento={"name":chk[i].id}
                list.push(elemento)
            }
               
        }
        
        var json = {
            "email": $("#Email").val(),
            "firstName": $("#FirstName").val(),
            "lastName": $("#LastName").val() , 
            "userName":  $("#UserName").val(), 
            "cellPhone": $("#CellPhone").val(),
            "apps":list,
            "cars":[]
        }
        updateData=JSON.stringify(json);
        console.log(updateData)
        return apiclient.updateDriver(updateData, onSucessUpdate,
            onErrorUpdate);
    }

    return {
        /*
            FUNCIONES DE LOGIN
        */
       login:function (name){
        var loginData = {
            "username": $('#correo').val(),
            "password": $('#contrasena').val(),
        };
        loginData = JSON.stringify(loginData);
        email=$('#correo').val();
        return apiclient.loginUser(loginData, onSucessLoing,
            onErrorLogin);
    },
        /*
            FUNCIONES DE REGISTRO
        */
        registroConductor: function (name) {
            var conductor = {
                "email": $('#correo').val(),
                "userName": $('#nombre').val(),
                "password": $('#contrasena').val(),
                "cellPhone": $('#cell').val(),
            };
            console.log(conductor)
            conductor = JSON.stringify(conductor); //parsea a formato JSON
            return apiclient.registroConductor(conductor, onSucessRegistro,
                onErrorRegistro);
        },
        cargarDatos:cargarDatos,
        LogOut:LogOut,
        updateDatos:updateDatos

    }
})();
