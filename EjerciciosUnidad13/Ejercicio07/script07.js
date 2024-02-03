window.onload = inicioPagina;

class clsPersona {
    constructor(nombre, apellidos, direccion, fechaNac, telefono, imageURL, idDepartamento) {
        this.id = -1;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.direccion = direccion;
        this.fechaNac = fechaNac;
        this.telefono = telefono;
        this.imageURL = imageURL;
        this.idDepartamento = idDepartamento;
    }
}

var listaAlumnos = [];
var listaDepartamentos = [];
var btnEnviar;
var accion;
var espacioForm;
function inicioPagina() {
    listaAlumnos = document.getElementById("tablaAlumnos");
    listaDepartamentos = document.getElementById("selectDepartamentos")
    btnEnviar = document.getElementById("btnEnviar").addEventListener("click", ejecutaAccion, false);
    accion = document.getElementById("tipoAccion");
    espacioForm = document.getElementById("espacioFormulario");
    peticionDepartamentos();

    if (localStorage.getItem('personaEliminadaFlag') == 'true') {
        showToast("Persona eliminada correctamente");
        localStorage.removeItem('personaEliminadaFlag');
    } else if (localStorage.getItem("personaAgregadaFlag") == 'true') {
        showToast("Persona agregada correctamente");
        localStorage.removeItem('personaEliminadaFlag');
    }
}

const optionGet = {
    method: "GET"
};
function peticionDepartamentos() {
    fetch("https://crudpaco.azurewebsites.net/api/departamentos", optionGet)
        .then(response => {
            if (response.ok) { //Si la petición es correcta
                return response.json(); //Parseamos los datos a json
            }
        }).then(data => {
            listaDepartamentos = data;  //Guardamos los datos en formato json en la tabla
            for (let i = 0; i < listaDepartamentos.length; i++) { //Creamos las opciones del select
                var opt = document.createElement("option");
                opt.value = listaDepartamentos[i].idDepartamento; //El value de cada opcion será el id del departmento
                opt.innerHTML = listaDepartamentos[i].nombreDepartamento; //El texto de cada opcion será el nombre del departento
                selectDepartamentos.appendChild(opt);
            }
            peticionPersonas(); //Llamamos a la funcion cuando ya se ha completado el proceso de la lista de departamentos
        });
}

function peticionPersonas() {
    var apiEntera = [];
    fetch("https://crudpaco.azurewebsites.net/api/personas", optionGet)
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
                var btnEditar = document.createElement("button");
                var btnEliminar = document.createElement("button");
                btnEditar.id = apiEntera[i].id;
                btnEditar.textContent = "Editar";
                btnEliminar.id = apiEntera[i].id;
                btnEliminar.textContent = "Eliminar";
                btnEditar.addEventListener("click", editarPersona, false);
                btnEliminar.addEventListener("click", eliminarPersona, false);

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
                tr.appendChild(btnEditar);
                tr.appendChild(btnEliminar);
                listaAlumnos.appendChild(tr);
            }
        });
}
function ejecutaAccion() {
    let nombre = document.getElementById("inputNombre").value;
    let apellidos = document.getElementById("inputApellidos").value;
    let fechaNac = document.getElementById("inputFechaNac").value + "T00:00:00"; //DateTime
    let direccion = document.getElementById("inputDireccion").value;
    let foto = document.getElementById("inputFoto").value;
    let numTelf = document.getElementById("inputNumTelf").value;
    let departamento = document.getElementById("selectDepartamentos").value;

    if (accion.innerHTML == "Insertar") {
        let persona = new clsPersona(nombre, apellidos, direccion, fechaNac, numTelf, foto, departamento);
        fetch("https://crudpaco.azurewebsites.net/api/personas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(persona),
        }).then(response => {
            if (response.ok) { //Si la petición es correcta
                localStorage.setItem('personaAgregadaFlag', 'true');
                location.reload();
            }
        });
    }
}

function editarPersona() {

}
function eliminarPersona(event) {
    let personaAEliminar = event.target;
    let idPersona = personaAEliminar.id;
    fetch(`https://crudpaco.azurewebsites.net/api/personas/${idPersona}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(response => {
        if (response.ok) { //Si la petición es correcta
            localStorage.setItem('personaEliminadaFlag', 'true');
            location.reload();
        }
    });
}

function showToast(mensaje) {
    var toast = document.createElement("label")
    toast.innerHTML = mensaje;
    toast.style.fontSize = 30;

    espacioForm.appendChild(toast);

    setTimeout(() => {
        espacioForm.removeChild(toast);
    }, 5000);
}