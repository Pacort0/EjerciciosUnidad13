 window.onload = tablaPersonas;

function tablaPersonas() {
    let requestPersonas = new XMLHttpRequest();
    let requestDepartamentos = new XMLHttpRequest();
    let tabla = document.getElementById("tablaPersonas");
    let divMensaje = document.getElementById("mensaje");
    let listaDepartamentos = [];

    requestPersonas.open("GET", "https://crudpaco.azurewebsites.net/api/personas");
    requestDepartamentos.open("GET", "https://crudpaco.azurewebsites.net/api/departamentos")

    requestDepartamentos.onreadystatechange = function () {
        if (requestDepartamentos.readyState < 4) {
            divMensaje.innerHTML = "Cagando...";
        } else {
            divMensaje.innerHTML = "";
            if (requestDepartamentos.readyState == 4 && requestDepartamentos.status == 200) {
                listaDepartamentos = JSON.parse(requestDepartamentos.responseText);
            }
        }
    };
    requestDepartamentos.send();
    requestPersonas.onreadystatechange = function () {
        if (requestPersonas.readyState < 4) {
            divMensaje.innerHTML = "Cagando...";
        } else {
            divMensaje.innerHTML = "";
            if (requestPersonas.readyState == 4 && requestPersonas.status == 200) {
                let apiEntera = JSON.parse(requestPersonas.responseText);
                for (i = 0; apiEntera.length; i++) {
                    var tr = document.createElement("tr");
                    var tdNombre = document.createElement("td");
                    var tdApellidos = document.createElement("td");
                    var tdDepartamento = document.createElement("td");

                    tdNombre.innerHTML = apiEntera[i].nombre;
                    tdApellidos.innerHTML = apiEntera[i].apellidos;
                    listaDepartamentos.forEach(function (departamento) {
                        if (departamento.idDepartamento == apiEntera[i].idDepartamento) {
                            tdDepartamento.innerHTML = departamento.nombreDepartamento;
                        }
                    });

                    tr.appendChild(tdNombre);
                    tr.appendChild(tdApellidos);
                    tr.appendChild(tdDepartamento);
                    tabla.appendChild(tr);
                }
            }
        }
    };
    requestPersonas.send();
}