window.onload = inicioPagina;

//clase persona
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
//clase departamento
class clsDepartamento {
    constructor(idDepartamento, nombreDepartamento) {
        this.idDepartamento = idDepartamento;
        this.nombreDepartamento = nombreDepartamento;
    }
}

var lista;
var listaPersonas;
var listaDepartamentos;
var btnPersonas;
var btnDepartamentos
var pagina;
var headerTabla;
var gifCargando;
var idFiltro;

function inicioPagina() {
    lista = document.getElementById("lista");
    btnPersonas = document.getElementById("btnPersonas");
    btnDepartamentos = document.getElementById("btnDepartamentos");
    headerTabla = document.getElementById("headerTabla");
    gifCargando = document.getElementById("GIFCargando");

    if (localStorage.getItem('cambioPaginaDepartamentosFlag') == 'true') {
        pagina = 2;
        localStorage.removeItem('cambioPaginaDepartamentosFlag');
    } else if (localStorage.getItem('recargaDepartamentosFlag') == 'true') {
        pagina = 2;
        localStorage.removeItem('recargaDepartamentosFlag');
    } else if (localStorage.getItem('cambioPaginaPersonasFlag') == 'true') {
        pagina = 1;
        localStorage.removeItem('cambioPaginaPersonasFlag');
    } else {
        pagina = 1; //Por defecto, la página es la de personas
    }

    btnPersonas = document.getElementById("btnPersonas").addEventListener("click", cambiaPagina, false);
    btnDepartamentos = document.getElementById("btnDepartamentos").addEventListener("click", cambiaPagina, false);

    peticionDepartamentos();

    if (pagina == 1) {

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
        if (localStorage.getItem('listaFiltradaFlag') > 0) {
            idFiltro = localStorage.getItem('listaFiltradaFlag');
            localStorage.removeItem('listaFiltradaFlag');
        } else {
            idFiltro = -1;
        }
    } else if (pagina == 2) {
        if (localStorage.getItem('departamentoEliminadoFlag') == 'true') {
            showToast("Departamento eliminado correctamente");
            localStorage.removeItem('departamentoEliminadoFlag');
        } else if (localStorage.getItem("departamentoAgregadoFlag") == 'true') {
            showToast("Departamento agregado correctamente");
            localStorage.removeItem('departamentoAgregadoFlag');
        } else if (localStorage.getItem("departamentoEditadoFlag") == "true") {
            showToast("Departamento editado correctamente");
            localStorage.removeItem('departamentoEditadoFlag');
        }
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
            if (pagina == 1) {

                // Añadimos el select de departamentos para filtrar
                const filtraDeptSelect = document.createElement("select");
                filtraDeptSelect.name = "filtroDepartamentos";
                filtraDeptSelect.id = "filtroDepartamentos";

                //Opción por defecto
                const optDefectoFiltro = document.createElement("option");
                optDefectoFiltro.value = "elige";
                optDefectoFiltro.selected = true;
                optDefectoFiltro.textContent = "Filtra por departamento";
                filtraDeptSelect.appendChild(optDefectoFiltro);

                //Opción para listar todos
                const optListarTodos = document.createElement("option");
                optListarTodos.value = 0;
                optListarTodos.textContent = "Listar todos";
                filtraDeptSelect.appendChild(optListarTodos);
                filtraDeptSelect.addEventListener("change", filtraDept, false);

                headerTabla.appendChild(filtraDeptSelect);

                for (let i = 0; i < listaDepartamentos.length; i++) { //Creamos las opciones del select
                    if (listaDepartamentos[i].idDepartamento != 5) {
                        var opt = document.createElement("option");
                        opt.value = listaDepartamentos[i].idDepartamento; //El value de cada opcion será el id del departmento
                        opt.innerHTML = listaDepartamentos[i].nombreDepartamento; //El texto de cada opcion será el nombre del departento
                        filtroDepartamentos.appendChild(opt.cloneNode(true));
                    }
                }
                peticionPersonas(idFiltro); //Llamamos a la funcion cuando ya se ha completado el proceso de la lista de departamentos
            } else if (pagina == 2) {
                const thead = document.createElement("thead");
                const trHead = document.createElement("tr");
                const thNombreDept = document.createElement("th");
                const thAccion = document.createElement("th");

                thNombreDept.innerHTML = "Nombre del departamento";
                thAccion.innerHTML = "Acción"
                trHead.appendChild(thNombreDept);
                trHead.appendChild(thAccion);
                thead.appendChild(trHead);
                lista.appendChild(thead);

                const tbody = document.createElement("tbody");

                for (let i = 0; i < listaDepartamentos.length; i++) {
                    if (listaDepartamentos[i].idDepartamento != 5) { //Es el departamento por defecto
                        //Creamos los elementos necesarios de la lista por persona
                        var tr = document.createElement("tr");
                        tr.addEventListener("click", editar, false);

                        var tdNombre = document.createElement("td");
                        var btnEliminar = document.createElement("button");
                        //Damos propiedades a los botones de cada persona
                        btnEliminar.id = listaDepartamentos[i].idDepartamento;
                        btnEliminar.textContent = "Eliminar";
                        btnEliminar.addEventListener("click", eliminar, false);

                        //Valor al nombre y apellidos de la persona
                        tdNombre.innerHTML = listaDepartamentos[i].nombreDepartamento;

                        //Metemos en la tabla los valores encontrados
                        tr.appendChild(tdNombre);
                        tr.appendChild(btnEliminar);

                        gifCargando.style.display = "none";

                        tr.id = listaDepartamentos[i].id;
                        tbody.appendChild(tr);
                    }
                    lista.appendChild(tbody);
                }
            }
        });
}

//Función que recoge una lista de persona de la api y rellena una tabla de personas con nombre de departamento
function peticionPersonas(filtrado) {
    if (pagina == 1) { //Solo se entra si la pagina es la pagina es la 1
        fetch("https://crudpaco.azurewebsites.net/api/personas", optionGet)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                listaPersonas = data;

                const thead = document.createElement("thead");
                const trHead = document.createElement("tr");
                const thFoto = document.createElement("th");
                const thNombre = document.createElement("th");
                const thApellidos = document.createElement("th");
                const thDepartamento = document.createElement("th");
                const thAccion = document.createElement("th");

                thFoto.innerHTML = "Foto";
                thNombre.innerHTML = "Nombre";
                thApellidos.innerHTML = "Apellidos";
                thDepartamento.innerHTML = "Departamento";
                thAccion.innerHTML = "Acción"
                trHead.appendChild(thFoto);
                trHead.appendChild(thNombre);
                trHead.appendChild(thApellidos);
                trHead.appendChild(thDepartamento);
                trHead.appendChild(thAccion);

                thead.appendChild(trHead);

                lista.appendChild(thead);

                const tbody = document.createElement("tbody");

                for (let i = 0; i < listaPersonas.length; i++) {

                    //Creamos los elementos necesarios de la lista por persona
                    var tr = document.createElement("tr");
                    tr.addEventListener("click", editar, false);
                    tr.id = listaPersonas[i].id;

                    var tdNombre = document.createElement("td");
                    var tdApellidos = document.createElement("td");
                    var tdDepartamento = document.createElement("td");
                    var tdFoto = document.createElement("td");
                    var btnEliminar = document.createElement("button");

                    tdNombre.id = listaPersonas[i].id;
                    tdApellidos.id = listaPersonas[i].id;
                    tdDepartamento.id = listaPersonas[i].id;
                    tdFoto.id = listaPersonas[i].id;

                    if (filtrado == -1) {
                        //Para hacer la búsqueda de departamento
                        let contadorDepartamentos = 0;
                        let encontrado = false;

                        //Damos propiedades a los botones de cada persona
                        btnEliminar.id = listaPersonas[i].id;
                        btnEliminar.textContent = "Eliminar";
                        btnEliminar.addEventListener("click", eliminar, false);

                        //Preparamos la foto de perfil
                        var fotica = document.createElement("img");
                        fotica.src = listaPersonas[i].imageURL;
                        fotica.alt = "Foto de perfil";
                        fotica.width = 50;
                        fotica.height = 50;

                        // Añadimos los elementos a las celdas
                        tdFoto.appendChild(fotica);
                        tdNombre.innerHTML = listaPersonas[i].nombre;
                        tdApellidos.innerHTML = listaPersonas[i].apellidos;

                        //Metemos en la tabla los valores encontrados
                        tr.appendChild(tdFoto);
                        tr.appendChild(tdNombre);
                        tr.appendChild(tdApellidos);
                        tr.appendChild(tdDepartamento);
                        tr.appendChild(btnEliminar);
                        //Buscamos el departamento de la persona y ponemos el nombre en la tabla
                        while (encontrado == false && contadorDepartamentos < listaDepartamentos.length) {
                            if (listaDepartamentos[contadorDepartamentos].idDepartamento == listaPersonas[i].idDepartamento) {
                                tdDepartamento.innerHTML = listaDepartamentos[contadorDepartamentos].nombreDepartamento;
                                encontrado = true;
                            }
                            contadorDepartamentos++;
                        }
                    } else {
                        let contadorDepartamentos = 0;
                        let encontrado = false;

                        while (contadorDepartamentos < listaDepartamentos.length && !encontrado) {
                            if (filtrado == listaPersonas[i].idDepartamento) { //Si el departamento coincide con el filtro
                                const idDept = listaDepartamentos.findIndex(dept => dept.idDepartamento == filtrado)
                                tdDepartamento.innerHTML = listaDepartamentos[idDept].nombreDepartamento;
                                encontrado = true;

                                //Damos propiedades a los botones de cada persona
                                btnEliminar.id = listaPersonas[i].id;
                                btnEliminar.textContent = "Eliminar";
                                btnEliminar.addEventListener("click", eliminar, false);

                                //Preparamos la foto de perfil
                                var fotica = document.createElement("img");
                                fotica.src = listaPersonas[i].imageURL;
                                fotica.alt = "Foto de perfil";
                                fotica.width = 50;
                                fotica.height = 50;

                                // Añadimos los elementos a las celdas
                                tdFoto.appendChild(fotica);
                                tdNombre.innerHTML = listaPersonas[i].nombre;
                                tdApellidos.innerHTML = listaPersonas[i].apellidos;

                                //Metemos en la tabla los valores encontrados
                                tr.appendChild(tdFoto);
                                tr.appendChild(tdNombre);
                                tr.appendChild(tdApellidos);
                                tr.appendChild(tdDepartamento);
                                tr.appendChild(btnEliminar);
                            }
                            contadorDepartamentos++;
                        }
                    }
                    gifCargando.style.display = "none";

                    tbody.appendChild(tr);
                }
                lista.appendChild(tbody);
            });
    }
}
function editar(event) {
    creaFormulario();
    const elementoAEditar = event.target;
    console.log(event.target);

    if (pagina == 1) {

        const datosPersona = listaPersonas.find(persona => persona.id == elementoAEditar.id);
        const fechaNacFormateada = datosPersona.fechaNac.substring(0, 10);
        idEdit = elementoAEditar.id;

        document.getElementById("inputNombre").value = datosPersona.nombre;
        document.getElementById("inputApellidos").value = datosPersona.apellidos;
        document.getElementById("inputDireccion").value = datosPersona.direccion;
        document.getElementById("inputFechaNac").value = fechaNacFormateada;
        document.getElementById("inputFoto").value = datosPersona.imageURL;
        if (datosPersona.idDepartamento == 5) {
            document.getElementById("selectDepartamentos").value = "elige";
        } else {
            document.getElementById("selectDepartamentos").value = datosPersona.idDepartamento;
        }
        document.getElementById("inputNumTelf").value = datosPersona.telefono;
    } else if (pagina == 2) {

        const datosDepartamento = listaDepartamentos.find(departamento => departamento.idDepartamento == elementoAEditar.id);
        idEdit = elementoAEditar.id;

        document.getElementById("inputNombre").value = datosDepartamento.nombreDepartamento;
    }
}

//Cuando se quiera eliminar a una persona, se llama a esta función.
//Se pregunta al usuario si está seguro de eliminar a dicha persona. En caso positivo, la eliminas
function eliminar(event) {
    const elementoAEliminar = event.target;
    const idElemento = elementoAEliminar.id;
    const seguro = confirm("¿Estás seguro de eliminar este elemento?\nEsta acción es irreversible.")

    if (seguro && pagina == 1) {
        fetch(`https://crudpaco.azurewebsites.net/api/personas/${idElemento}`, {
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
    } else if (seguro && pagina == 2) {
        fetch(`https://crudpaco.azurewebsites.net/api/departamentos/${idElemento}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(response => {
            if (response.ok) { //Si la petición es correcta
                localStorage.setItem('departamentoEliminadoFlag', 'true');
                localStorage.setItem('recargaDepartamentosFlag', 'true');
                location.reload();
            }
        });
    }
}
function filtraDept() {
    const idDept = document.getElementById("filtroDepartamentos").value;
    localStorage.setItem('listaFiltradaFlag', idDept);
    location.reload();
}

function cancelarAccion() {
    accion.innerHTML == "Insertar"
    if (pagina == 1) {
        document.getElementById("inputNombre").value = "";
        document.getElementById("inputApellidos").value = "";
        document.getElementById("inputDireccion").value = "";
        document.getElementById("inputFechaNac").value = "";
        document.getElementById("inputFoto").value = "";
        document.getElementById("selectDepartamentos").value = "elige";
        document.getElementById("inputNumTelf").value = "";
    } else if (pagina == 2) {
        document.getElementById("inputNombre").value = "";
    }
}
function cambiaPagina(evento) {
    if (evento.target.id == "btnPersonas") {
        localStorage.setItem('cambioPaginaPersonasFlag', 'true');
        location.reload();
    } else if (evento.target.id == "btnDepartamentos") {
        localStorage.setItem('cambioPaginaDepartamentosFlag', 'true');
        location.reload();
    }
}

function showToast() {

}
function creaFormulario() {
    //Tomamos el formulario de la pagina HTML
    var bodyTabla = document.getElementById("bodyTabla");
    var divForm = document.createElement("div");
    divForm.className = "modalForm";
    var formulario = document.createElement("form");

    if (pagina == 1) {
        // Elementos del formulario
        var elementos = [
            { label: "Nombre", type: "text", id: "inputNombre", placeholder: "Nombre", required: true },
            { label: "Apellidos", type: "text", id: "inputApellidos", placeholder: "Apellidos", required: true },
            { label: "Fecha de nacimiento", type: "date", id: "inputFechaNac", placeholder: "Fecha de nacimiento", required: true },
            { label: "Direccion", type: "text", id: "inputDireccion", placeholder: "Dirección", required: true },
            { label: "Número de teléfono", type: "tel", id: "inputNumTelf", placeholder: "Núm. de teléfono", required: true },
            { label: "Foto", type: "text", id: "inputFoto", placeholder: "Url de imagen", required: true },
        ];

        // Creamos cada label y cada input del form linea a linea
        elementos.forEach(function (elemento) {
            var label = document.createElement("label");
            label.htmlFor = elemento.id;
            label.textContent = elemento.label;
            formulario.appendChild(label);

            formulario.appendChild(document.createElement("br"));

            var input = document.createElement("input");
            input.type = elemento.type;
            input.id = elemento.id;
            input.placeholder = elemento.placeholder;
            if (elemento.required) {
                input.required = true;
            }
            formulario.appendChild(input);

            formulario.appendChild(document.createElement("br"));
        });

        // Añadimos el select de departamentos
        const labelDept = document.createElement("label");
        labelDept.textContent = "Escoge un departamento";
        formulario.appendChild(labelDept);

        //Si no pongo un div me da error el botón de submit
        const divDept = document.createElement("div");
        divDept.id = "divSelectDepartamentos";

        const departmentSelect = document.createElement("select");
        departmentSelect.name = "tablaDepartamentos";
        departmentSelect.id = "selectDepartamentos";

        //Opción por defecto
        const defaultOption = document.createElement("option");
        defaultOption.value = "elige";
        defaultOption.selected = true;
        defaultOption.textContent = "Elige un departamento";
        departmentSelect.appendChild(defaultOption);

        for (let i = 0; i < listaDepartamentos.length; i++) { //Creamos las opciones del select
            if (listaDepartamentos[i].idDepartamento != 5) {
                var opt = document.createElement("option");
                opt.value = listaDepartamentos[i].idDepartamento; //El value de cada opcion será el id del departmento
                opt.innerHTML = listaDepartamentos[i].nombreDepartamento; //El texto de cada opcion será el nombre del departento
                departmentSelect.appendChild(opt);
            }
        }

        divDept.appendChild(departmentSelect);
        formulario.appendChild(divDept);

        divForm.appendChild(formulario);

        bodyTabla.appendChild(divForm);

    } else if (pagina == 2) { //Si la pagina es la de los departamentos
        var elementos = [
            { label: "Nombre del departamento", type: "text", id: "inputNombre", placeholder: "Nombre", required: true },
        ];

        // Creamos cada label y cada input del form linea a linea
        elementos.forEach(function (elementInfo) {
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
    }
    const botonesDiv = document.createElement("div");
    botonesDiv.id = "botonesFormulario";

    const btnEnviar = document.createElement("input");
    btnEnviar.type = "button";
    btnEnviar.id = "btnEnviar";
    btnEnviar.value = "Enviar";
    botonesDiv.appendChild(btnEnviar);

    const btnCancelar = document.createElement("input");
    btnCancelar.type = "button";
    btnCancelar.id = "btnCancelar";
    btnCancelar.value = "Cancelar";
    botonesDiv.appendChild(btnCancelar);

    formulario.appendChild(botonesDiv);
}