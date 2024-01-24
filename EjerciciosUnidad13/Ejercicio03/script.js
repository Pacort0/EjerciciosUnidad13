 window.onload = inicializar;

var divMensaje;
var listaDepartamentos = [];
var tabla;
function inicializar() {
    divMensaje = document.getElementById("mensaje");
    tabla = document.getElementById("tablaPersonas");
    peticionDepartamentos();
}

function peticionDepartamentos() {
    let requestDepartamentos = new XMLHttpRequest();

    requestDepartamentos.open("GET", "https://crudpaco.azurewebsites.net/api/departamentos")

    requestDepartamentos.onreadystatechange = function () {
        if (requestDepartamentos.readyState < 4) {
            divMensaje.innerHTML = "Cagando...";
        } else {
            divMensaje.innerHTML = "";
            if (requestDepartamentos.readyState == 4 && requestDepartamentos.status == 200) {
                listaDepartamentos = JSON.parse(requestDepartamentos.responseText);
                cargaPersonas();
            }
        }
    };
    requestDepartamentos.send();

    function cargaPersonas() {
        let requestPersonas = new XMLHttpRequest();
        requestPersonas.open("GET", "https://crudpaco.azurewebsites.net/api/personas");
        let contadorDepartamentos = 0;
        let contadorPersonas = 0;
        let encontrado = false;

        requestPersonas.onreadystatechange = function () {
            if (requestPersonas.readyState < 4) {
                divMensaje.innerHTML = "Cagando...";
            } else {
                divMensaje.innerHTML = "";
                if (requestPersonas.readyState == 4 && requestPersonas.status == 200) {
                    let apiEntera = JSON.parse(requestPersonas.responseText);
                    for (i = 0; apiEntera.length; i++) {
                        let tr = document.createElement("tr");
                        let tdNombre = document.createElement("td");
                        let tdApellidos = document.createElement("td");
                        let tdDepartamento = document.createElement("td");

                        tdNombre.innerHTML = apiEntera[i].nombre;
                        tdApellidos.innerHTML = apiEntera[i].apellidos;

                        //Cambiar bucle a while
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
    
}