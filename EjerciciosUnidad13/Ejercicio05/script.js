window.onload = inicializar;

var divMensaje;
var listaDepartamentos = [];
function inicializar() {
    divMensaje = document.getElementById("mensaje");
    peticionDepartamentos();
}
const options = {
    method: "GET"
};
function peticionDepartamentos() {
    let tabla = document.getElementById("tablaPersonas");
    divMensaje = document.getElementById("mensaje");
    var listaDepartamentos = [];
    var apiEntera = [];

    fetch("https://crudpaco.azurewebsites.net/api/departamentos", options)
        .then(response => {
            if (response.ok) { //Si la petición es correcta
                return response.json(); //Parseamos los datos a json
            }
        }).then(data => listaDepartamentos = data); //Guardamos los datos en formato json en la tabla

    fetch("https://crudpaco.azurewebsites.net/api/personas", options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            apiEntera = data;

            for (let i = 0; i < apiEntera.length; i++) {
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
        });

}