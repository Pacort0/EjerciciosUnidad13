// JavaScript source code

window.onload = inicioPagina;

var listaModelos = [];
var listaMarcas = [];
var selectMarcas;
function inicioPagina() {
    selectMarcas = document.getElementById("marcas");
    selectMarcas.addEventListener("change", tablaModelos, false)
    peticionMarcas();
}
const options = {
    method: "GET"
};

function peticionMarcas() {
    fetch("https://marcasycochespaco.azurewebsites.net/api/marcas", options)
        .then(response => {
            if (response.ok) { //Si la petición es correcta
                return response.json(); //Parseamos los datos a json
            }
        }).then(data => {
            listaMarcas = data;  //Guardamos los datos en formato json en la tabla
            for (let i = 0; i < listaMarcas.length; i++) {
                var opt = document.createElement("option");
                opt.value = listaMarcas[i].id;
                opt.innerHTML = listaMarcas[i].nombre;
                selectMarcas.appendChild(opt);
            }
            peticionModelos();
        });
}
function peticionModelos() {
    fetch("https://marcasycochespaco.azurewebsites.net/api/modelos", options)
        .then(response => {
            if (response.ok) { //Si la petición es correcta
                return response.json(); //Parseamos los datos a json
            }
        }).then(data => {
            listaModelos = data;  //Guardamos los datos en formato json en la tabla
        });
}
function tablaModelos() {
    tablaExistente = document.getElementById("coches")
    if (tablaExistente) {  //Seleccionamos la tabla (si existe)) 
        document.body.removeChild(tablaExistente) //Eliminamos toda la tabla
    }

    var marca = document.getElementById("marcas").value; //Cogemos la marca escogida por el usuario
    var tabla = document.createElement("table"); //Creamos una tabla

    tabla.createTHead().innerHTML = "Modelos"; //Le damos una cabecera general a la tabla
    tabla.id = "coches"; //Le damos un id a la tabla para poder seleccionarla más tarde

    listaModelos.forEach((modelo) => {
        if (modelo.idMarca == marca) {
            tabla.insertRow().insertCell(0).innerHTML = modelo.nombre;
        }
    });
     document.body.appendChild(tabla); //Añadimos la tabla creada a la página como hija del elemento 'body'
}