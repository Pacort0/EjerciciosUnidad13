// JavaScript source code

window.onload = inicioPagina;

class DTOModelo{
    constructor(id, precio) {
        this.id = id;
        this.precio = precio;
    }   
}

var listaModelos = [];
var listaMarcas = [];
var dictModelosCambiados = {} ;
var selectMarcas;
var btnGuardar;
function inicioPagina() {
    selectMarcas = document.getElementById("marcas");
    btnGuardar = document.getElementById("btnGuardar");
    selectMarcas.addEventListener("change", tablaModelos, false);
    btnGuardar.addEventListener("click", guardaCambios, false);
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
            for (let i = 0; i < listaMarcas.length; i++) { //Creamos las opciones del select
                var opt = document.createElement("option");
                opt.value = listaMarcas[i].id; //El value de cada opcion será el id de la marca
                opt.innerHTML = listaMarcas[i].nombre; //El texto de cada opcion será el nombre de la marca
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

    var marca = document.getElementById("marcas").value; //Cogemos el id de la marca escogida por el usuario
    var tabla = document.createElement("table"); //Creamos una tabla

    if (marca != "elige") {
        tabla.createTHead().innerHTML = "Modelos"; //Le damos una cabecera general a la tabla
        tabla.id = "coches"; //Le damos un id a la tabla para poder seleccionarla más tarde

        listaModelos.forEach((modelo) => { //Recorremos los modelos
            if (modelo.idMarca == marca) { //Si la marca es la seleccionada por el usuario
                let nuevafila = tabla.insertRow(); //Creamos una fila
                nuevafila.insertCell(0).innerHTML = modelo.nombre;
                let celdaPrecio = nuevafila.insertCell(1);
                let input = document.createElement("input");
                input.type = "number";
                input.name = modelo.id;
                input.value = modelo.precio;
                input.addEventListener("change", precioCambiado(modelo.precio), false);
                celdaPrecio.appendChild(input);
            }
        });
        document.body.appendChild(tabla); //Añadimos la tabla creada a la página como hija del elemento 'body'
    }
}

function precioCambiado(precioAnterior) {
    return function (event) {
        let modeloAlterado = event.target;
        let precioNuevo = modeloAlterado.value;
        let indexModeloAlterado = listaModelosCambiados.indexOf(modeloAlterado.name)

        if (precioAnterior < precioNuevo) {
            if (indexModeloAlterado == -1) { //Si el elemento no está en la lista
                dictModelosCambiados.modeloAlterado.name = precioNuevo;
            }
        } else {
            if (indexModeloAlterado >= 0) {
                listaModelosCambiados.splice(indexModeloAlterado)
            }
            console.log("El precio debe ser mayor que el previo")
        }
        console.log("Valores del array:" + listaModelosCambiados)
    }
}

function guardaCambios() {
    let textoRes = document.getElementById("resultado");
    if (listaModelosCambiados.length == 0) {
        textoRes.innerHTML = "Me pica el culo";
    } else {
        textoRes.innerHTML = "";
        listaModelosCambiados.forEach((modelo) => {
            let modelo = new DTOModelo(modelo.id)
        });
    }
}