 window.onload = tablaPersonas;

function tablaPersonas() {
    let request = new XMLHttpRequest();
    let tabla = document.getElementById("tablaPersonas");
    let divMensaje = document.getElementById("mensaje");

    request.open("GET", "https://crudpaco.azurewebsites.net/api/personas");

    request.onreadystatechange = function () {
        if (request.readyState < 4) {
            divMensaje.innerHTML = "Cagando...";
        } else {
            divMensaje.innerHTML = "";
            if (request.readyState == 4 && request.status == 200) {
                let apiEntera = JSON.parse(request.responseText);
                for (i = 0; apiEntera.length; i++) {
                    var tr = document.createElement("tr");
                    var tdNombre = document.createElement("td");
                    var tdApellidos = document.createElement("td");
                    var tdDepartamento = document.createElement("td");

                    tdNombre.innerHTML = apiEntera[i].nombre;
                    tdApellidos.innerHTML = apiEntera[i].apellidos;
                    tdDepartamento.innerHTML = apiEntera[i].idDepartamento;

                    tr.appendChild(tdNombre);
                    tr.appendChild(tdApellidos);
                    tr.appendChild(tdDepartamento);
                    tabla.appendChild(tr);
                }
            }
        }
    };
    request.send();
}