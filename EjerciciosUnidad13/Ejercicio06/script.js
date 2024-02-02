// JavaScript source code

window.onload = inicioPagina;

class DTOModelo {
    constructor(Precio, Id) {
        this.Id = Id;
        this.Precio = Precio;
    }
}

var listaModelos = [];
var listaMarcas = [];
var listaModelosCambiados = [];
var selectMarcas;
var btnGuardar;
function inicioPagina() {
    selectMarcas = document.getElementById("marcas");
    btnGuardar = document.getElementById("btnGuardar");
    selectMarcas.addEventListener("change", tablaModelos, false);
    btnGuardar.addEventListener("click", guardaCambios, false);
    peticionMarcas();
}
const optionGet = {
    method: "GET"
};
const optionPut = {
    method: "PUT"
}

function peticionMarcas() {
    fetch("https://marcasycochespaco.azurewebsites.net/api/marcas", optionGet)
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
    fetch("https://marcasycochespaco.azurewebsites.net/api/modelos", optionGet)
        .then(response => {
            if (response.ok) { //Si la petición es correcta
                return response.json(); //Parseamos los datos a json
            }
        }).then(data => {
            listaModelos = data;  //Guardamos los datos en formato json en la tabla
        });
}
function tablaModelos() {
    tablaExistente = document.getElementById("coches");
    let div = document.getElementById("tablaModelos")
    if (tablaExistente) {  //Seleccionamos la tabla (si existe)) 
        div.removeChild(tablaExistente) //Eliminamos toda la tabla
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
        div.appendChild(tabla); //Añadimos la tabla creada a la página como hija del elemento 'body'
    }
}

function precioCambiado(precioAnterior) {
    return function (event) {
        let precioIntroducidoMal = document.getElementById("preciomal");
        let modeloAlterado = event.target;
        let precioNuevo = modeloAlterado.value;
        let indexModeloAlterado = listaModelosCambiados.findIndex(modelo => modelo.Id === modeloAlterado.name);

        if (precioAnterior < precioNuevo) {
            if (indexModeloAlterado == -1) { //Si el elemento no está en la lista
                let m = new DTOModelo(precioNuevo, modeloAlterado.name)
                listaModelosCambiados.push(m);
                precioIntroducidoMal.innerHTML = "";
            }
        } else {
            if (indexModeloAlterado >= 0) {
                listaModelosCambiados.splice(indexModeloAlterado)
            }
            modeloAlterado.value = precioAnterior;
            precioIntroducidoMal.style.color = "red";
            precioIntroducidoMal.innerHTML = "El precio debe ser mayor que el previo";
        }
    }
}

function guardaCambios() {
    let textoRes = document.getElementById("resultado");
    if (listaModelosCambiados.length == 0) {
        textoRes.innerHTML = "No se ha alterado ningún precio correctamente";
    } else {
        textoRes.innerHTML = "";
        fetch("https://marcasycochespaco.azurewebsites.net/api/modelos", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(listaModelosCambiados),
        }).then(response => {
            if (response.ok) { //Si la petición es correcta
                return response.json(); //Parseamos los datos a json
            }
        }).then(data => {
            textoRes.innerHTML = "Se ha(n) alterado " + listaModelosCambiados.length + " precio(s)";  //Guardamos los datos en formato json en la tabla
            precioIntroducidoMal.innerHTML = "";
        });
        peticionModelos(); //Actualizamos la tabla de modelos
    }
}