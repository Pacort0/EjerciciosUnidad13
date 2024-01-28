window.onload = inicializar;

var divMensaje;
var listaDepartamentos = [];
var tabla;
function inicializar() {
    divMensaje = document.getElementById("mensaje");
    tabla = document.getElementById("tablaPersonas");
    peticionDepartamentos();
}
const options = {
    method: "GET"
};
function peticionDepartamentos() { 
    fetch("https://crudpaco.azurewebsites.net/api/departamentos", options)
        .then(response => {
            if (response.ok) { //Si la petición es correcta
                return response.json(); //Parseamos los datos a json
            }
        }).then(data => {
            listaDepartamentos = data;  //Guardamos los datos en formato json en la tabla
            peticionPersonas(); //Llamamos a la funcion cuando ya se ha completado el proceso de la lista de departamentos
        });
}

function peticionPersonas(){
    var apiEntera = [];
    fetch("https://crudpaco.azurewebsites.net/api/personas", options)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            apiEntera = data;

            for (let i = 0; i < apiEntera.length; i++) {
                let contadorDepartamentos = 0;
                let encontrado = false;
                var tr = document.createElement("tr");
                var tdNombre = document.createElement("td");
                var tdApellidos = document.createElement("td");
                var tdDepartamento = document.createElement("td");

                tdNombre.innerHTML = apiEntera[i].nombre;
                tdApellidos.innerHTML = apiEntera[i].apellidos;

                while (encontrado == false && contadorDepartamentos < listaDepartamentos.length) {
                    if (listaDepartamentos[contadorDepartamentos].idDepartamento == apiEntera[i].idDepartamento) {
                        tdDepartamento.innerHTML = listaDepartamentos[contadorDepartamentos].nombreDepartamento;
                        encontrado = true;
                    }
                    contadorDepartamentos++;
                };

                tr.appendChild(tdNombre);
                tr.appendChild(tdApellidos);
                tr.appendChild(tdDepartamento);
                tabla.appendChild(tr);
            }
        });

}