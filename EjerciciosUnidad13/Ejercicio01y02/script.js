window.onload = inicializaFunciones;

function inicializaFunciones() {
    document.getElementById("btnSaludarServer").addEventListener("click", saludaServer, false);
}

function saludaServer() {
    let request = new XMLHttpRequest();
    let divMensaje = document.getElementById("mensaje");
    let indice = 3;

    request.open("GET", "https://crudnervion.azurewebsites.net/api/personas");

    request.onreadystatechange = function () {
        if (request.readyState < 4) {
            divMensaje.innerHTML = "Cagando...";
        } else {
            if (request.readyState == 4 && request.status == 200) {
                let response = JSON.parse(request.responseText);
                divMensaje.innerHTML = response[indice].nombre + " " + response[indice].apellidos;
            }
        }
    };
    request.send();
}