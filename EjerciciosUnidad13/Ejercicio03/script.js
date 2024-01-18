window.onload = tablaPersonas;

function tablaPersonas() {
    let request = new XMLHttpRequest();
    let tabla = document.getElementById("tablaPersonas");

    request.open("GET", "https://crudpaco.azurewebsites.net/api/personas");

    request.onreadystatechange = function () {
        if (request.readyState < 4) {
            divMensaje.innerHTML = "Cagando...";
        } else {
            if (request.readyState == 4 && request.status == 200) {
                let apiEntera = request.responseText;
                apiEntera.forEach((persona))
            }
        }
    };
    request.send();
}