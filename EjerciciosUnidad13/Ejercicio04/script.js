﻿window.onload = iniciaEventos;

function iniciaEventos() {
    document.getElementById("btnBorrar").addEventListener("click", borraPersona, false)
}

function borraPersona() {
    let request = new XMLHttpRequest();
    let divMensaje = document.getElementById("mensaje");
    var personaABorrar = document.getElementById("entryPersona").value;
    request.open("DELETE", "https://crudpaco.azurewebsites.net/api/personas/" + personaABorrar);

    request.onreadystatechange = function () {
        if (request.readyState < 4) {
            divMensaje.innerHTML = "Cagando...";
        } else {
            if (request.readyState == 4 && request.status == 200) {
                if (request.responseText>0) {
                     divMensaje.innerHTML = "Persona borrada con éxito";
                } else {
                    divMensaje.innerHTML = "ID no encontrada";
                }
            } else {
                divMensaje.innerHTML = "Error en la request (la persona no existe)";
            }
        }
    };
    request.send();
}


//window.onload = iniciaEventos;

//function iniciaEventos() {
//    document.getElementById("btnBorrar").addEventListener("click", borraPersona, false)
//}

//function borraPersona() {
//    let divMensaje = document.getElementById("mensaje");
//    var personaABorrar = document.getElementById("entryPersona");
//    let request = new XMLHttpRequest();

//    request.open("DELETE", "https://crudpaco.azurewebsites.net/api/personas");

//    request.onreadystatechange = function () {
//        if (request.readyState == 4) {
//            if (request.status == 200) {
//                let apiEntera = JSON.parse(request.responseText);
//                let personaEncontrada = apiEntera.find(persona => persona.ID == personaABorrar);
//                if (personaEncontrada) {
//                    divMensaje.innerHTML = "Persona borrada con éxito";
//                } else {
//                    divMensaje.innerHTML = "ID no encontrada";
//                }
//            } else {
//                divMensaje.innerHTML = "Error en la solicitud: " + request.status;
//            }
//        } else {
//            divMensaje.innerHTML = "Cargando...";
//        }
//    };
//    request.send();
//}