window.onload = inicioPagina;

class clsPersona {
    constructor(id, nombre, apellidos, direccion, fechaNac, telefono, imageURL, idDepartamento) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.direccion = direccion;
        this.fechaNac = fechaNac;
        this.telefono = telefono;
        this.imageURL = imageURL;
        this.idDepartamento = idDepartamento;
    }
}

class clsDepartamento {
    constructor(idDepartamento, nombreDepartamento) {
        this.idDepartamento = idDepartamento;
        this.nombreDepartamento = nombreDepartamento;
    }
}

var listaPersonasHTML = [];
var listaDepartamentos = [];
var btnEnviar;
var accion;
var espacioForm;
var listaPersonas = [];
var idEdit;

//Cuando se carga la página, se llama a esta función
function inicioPagina() {
    creaFormulario();
    listaPersonasHTML = document.getElementById("tablaAlumnos");
    listaDepartamentos = document.getElementById("selectDepartamentos")
    btnEnviar = document.getElementById("btnEnviar").addEventListener("click", ejecutaAccion, false);
    accion = document.getElementById("tipoAccion");
    espacioForm = document.getElementById("espacioFormulario");
    idEdit = document.getElementById("idEdit");
    peticionDepartamentos();

    //'Toasts' tras realizar algún tipo de cambio en la tabla de alumnos
    if (localStorage.getItem('personaEliminadaFlag') == 'true') {
        showToast("Persona eliminada correctamente");
        localStorage.removeItem('personaEliminadaFlag');
    } else if (localStorage.getItem("personaAgregadaFlag") == 'true') {
        showToast("Persona agregada correctamente");
        localStorage.removeItem('personaAgregadaFlag');
    } else if (localStorage.getItem("personaEditadaFlag") == "true") {
        showToast("Persona editada correctamente");
        localStorage.removeItem('personaEditadaFlag');
    }
}

function creaFormulario() {
    //Tomamos el formulario de la pagina HTML
    var formulario = document.getElementById("idFormulario");

    // Elementos del formulario
    var elements = [
        { label: "Nombre", type: "text", id: "inputNombre", placeholder: "Nombre", required: true },
        { label: "Apellidos", type: "text", id: "inputApellidos", placeholder: "Apellidos", required: true },
        { label: "Fecha de nacimiento", type: "date", id: "inputFechaNac", placeholder: "Fecha de nacimiento", required: true },
        { label: "Direccion", type: "text", id: "inputDireccion", placeholder: "Dirección", required: true },
        { label: "Número de teléfono", type: "tel", id: "inputNumTelf", placeholder: "Núm. de teléfono", required: true },
        { label: "Foto", type: "text", id: "inputFoto", placeholder: "Url de imagen", required: true },
    ];

    // Creamos cada label y cada input del form linea a linea
    elements.forEach(function (elementInfo) {
        var label = document.createElement("label");
        label.htmlFor = elementInfo.id;
        label.textContent = elementInfo.label;
        formulario.appendChild(label);

        formulario.appendChild(document.createElement("br"));

        var input = document.createElement("input");
        input.type = elementInfo.type;
        input.id = elementInfo.id;
        input.placeholder = elementInfo.placeholder;
        if (elementInfo.required) {
            input.required = true;
        }
        formulario.appendChild(input);

        formulario.appendChild(document.createElement("br"));
    });

    // Añadimos el select de departamentos
    const departmentLabel = document.createElement("label");
    departmentLabel.textContent = "Escoge un departamento";
    formulario.appendChild(departmentLabel);

    //Si no pongo un div me da error el botón de submit
    const departmentDiv = document.createElement("div");
    departmentDiv.id = "divSelectDepartamentos";
    const departmentSelect = document.createElement("select");
    departmentSelect.name = "tablaDepartamentos";
    departmentSelect.id = "selectDepartamentos";

    //Opción por defecto
    const defaultOption = document.createElement("option");
    defaultOption.value = "elige";
    defaultOption.selected = true;
    defaultOption.textContent = "Elige un departamento";
    departmentSelect.appendChild(defaultOption);

    departmentDiv.appendChild(departmentSelect);
    formulario.appendChild(departmentDiv);

    const btnEnviar = document.createElement("input");
    btnEnviar.type = "button";
    btnEnviar.id = "btnEnviar";
    btnEnviar.value = "Enviar";
    formulario.appendChild(btnEnviar);
}


const optionGet = {
    method: "GET"
};
//Función que recoge una lista de departamentos de la api y rellena el select de departamentos
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

//Función que recoge una lista de persona de la api y rellena una tabla de personas con nombre de departamento
function peticionPersonas() {
    fetch("https://crudpaco.azurewebsites.net/api/personas", optionGet)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            listaPersonas = data;

            for (let i = 0; i < listaPersonas.length; i++) {
                //Para hacer la búsqueda de departamento
                let contadorDepartamentos = 0;
                let encontrado = false;
                //Creamos los elementos necesarios de la lista por persona
                var tr = document.createElement("tr");
                var tdNombre = document.createElement("td");
                var tdApellidos = document.createElement("td");
                var tdDepartamento = document.createElement("td");
                var btnEditar = document.createElement("button");
                var btnEliminar = document.createElement("button");
                //Damos propiedades a los botones de cada persona
                btnEditar.id = listaPersonas[i].id;
                btnEditar.textContent = "Editar";
                btnEliminar.id = listaPersonas[i].id;
                btnEliminar.textContent = "Eliminar";
                btnEditar.addEventListener("click", editarPersona, false);
                btnEliminar.addEventListener("click", eliminarPersona, false);

                //Valor al nombre y apellidos de la persona
                tdNombre.innerHTML = listaPersonas[i].nombre;
                tdApellidos.innerHTML = listaPersonas[i].apellidos;

                //Buscamos el departamento de la persona y ponemos el nombre en la tabla
                while (encontrado == false && contadorDepartamentos < listaDepartamentos.length) {
                    if (listaDepartamentos[contadorDepartamentos].idDepartamento == listaPersonas[i].idDepartamento) {
                        tdDepartamento.innerHTML = listaDepartamentos[contadorDepartamentos].nombreDepartamento;
                        encontrado = true;
                    }
                    contadorDepartamentos++;
                };

                //Metemos en la tabla los valores encontrados
                tr.appendChild(tdNombre);
                tr.appendChild(tdApellidos);
                tr.appendChild(tdDepartamento);
                tr.appendChild(btnEditar);
                tr.appendChild(btnEliminar);
                listaPersonasHTML.appendChild(tr);
            }
        });
}

//Cuando se pulse el botón de 'Editar', se llama a esta función, que pasa los datos de la persona a editar al formulario
function editarPersona(event) {
    accion.innerHTML = "Editar";
    const personaAEditar = event.target;
    const datosPersona = listaPersonas.find(persona => persona.id == personaAEditar.id);
    const fechaNacFormateada = datosPersona.fechaNac.substring(0, 10);
    idEdit = personaAEditar.id;

    document.getElementById("inputNombre").value = datosPersona.nombre;
    document.getElementById("inputApellidos").value = datosPersona.apellidos;
    document.getElementById("inputDireccion").value = datosPersona.direccion;
    document.getElementById("inputFechaNac").value = fechaNacFormateada;
    document.getElementById("inputFoto").value = datosPersona.imageURL;
    document.getElementById("selectDepartamentos").value = datosPersona.idDepartamento;
    document.getElementById("inputNumTelf").value = datosPersona.telefono;
}
//Cuando se quiera eliminar a una persona, se llama a esta función.
//Se pregunta al usuario si está seguro de eliminar a dicha persona. En caso positivo, la eliminas
function eliminarPersona(event) {
    const personaAEliminar = event.target;
    const idPersona = personaAEliminar.id;
    const seguro = confirm("¿Estás seguro de eliminar a esta persona?\nEsta acción es irreversible.")
    if (seguro) {
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
}

//Función que muestra un mensaje temporal por pantalla
function showToast(mensaje) {
    var toast = document.createElement("label")
    toast.innerHTML = mensaje.bold();
    toast.style.fontSize = 30;

    espacioForm.appendChild(toast);

    setTimeout(() => {
        espacioForm.removeChild(toast);
    }, 5000);
}

//Función que se llama cuando se presiona el botón de Enviar.
//Esta función comprueba si se trata de un post o de un put y actúa en consecuencia
function ejecutaAccion() {
    const nombre = document.getElementById("inputNombre").value;
    const apellidos = document.getElementById("inputApellidos").value;
    const fechaNac = document.getElementById("inputFechaNac").value + "T00:00:00"; //DateTime
    const direccion = document.getElementById("inputDireccion").value;
    const foto = document.getElementById("inputFoto").value;
    const numTelf = document.getElementById("inputNumTelf").value;
    const departamento = document.getElementById("selectDepartamentos").value;

    if (accion.innerHTML == "Insertar") {
        const persona = new clsPersona(-1, nombre, apellidos, direccion, fechaNac, numTelf, foto, departamento);
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
    } else if (accion.innerHTML == "Editar") {
        const persona = new clsPersona(idEdit, nombre, apellidos, direccion, fechaNac, numTelf, foto, departamento);
        fetch(`https://crudpaco.azurewebsites.net/api/personas/${idEdit}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(persona),
        }).then(response => {
            if (response.ok) { //Si la petición es correcta
                localStorage.setItem('personaEditadaFlag', 'true');
                location.reload();
            }
        });
    }
}