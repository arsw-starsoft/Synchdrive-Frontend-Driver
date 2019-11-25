appEnServicio = (function () {
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

        }
    }
})();