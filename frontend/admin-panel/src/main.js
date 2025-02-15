var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
// URL base de la API
const apiUrl = "http://localhost:8082";
const apiEmpleados = apiUrl + "/empleado";
// Referencias de los elementos en el DOM
const empleadosTable = (_a = document.getElementById('empleados-table')) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('tbody')[0];
const empleadoForm = document.getElementById('empleado-form');
const empleadoIdInput = document.getElementById('empleado-id');
const empleadoNombreInput = document.getElementById('empleado-nombre');
const empleadoPasswordInput = document.getElementById('empleado-password');
(_b = document.getElementById('generar-informes-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => generarModalFechas());
;
const cargarTablaEmpleados = (empleados) => {
    empleadosTable.innerHTML = ''; // Limpiar tabla antes de renderizar
    empleados.forEach(empleado => {
        var _a, _b, _c;
        const row = empleadosTable.insertRow();
        const dni = empleado.dni ? empleado.dni : 'No disponible';
        const nombre = empleado.nombre ? empleado.nombre : 'No disponible';
        row.innerHTML = `
        <td>${dni}</td>
        <td>${nombre}</td>
        <td>
          <button id="edit-${empleado.id}" class="edit-button">Editar</button>
          <button id="generar-informe-${empleado.id}">Generar Informe</button>
          <button id="delete-${empleado.id}" class="delete-button">Eliminar</button>
        </td>
      `;
        // Asociar los eventos de editar y eliminar
        (_a = document.getElementById(`delete-${empleado.id}`)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => deleteEmpleado(empleado.id));
        (_b = document.getElementById(`generar-informe-${empleado.id}`)) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => generarModalFechas(empleado.id));
        (_c = document.getElementById(`edit-${empleado.id}`)) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => editarEmpleado(empleado));
    });
};
// Función para cargar los empleados
const loadEmpleados = () => __awaiter(this, void 0, void 0, function* () {
    try {
        const jwt = sessionStorage.getItem('jsonWebToken');
        const response = yield fetch(apiEmpleados, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        if (!response.ok) {
            if (response.status === 403) {
                authenticate();
            }
            else {
                alert("Error al cargar empleados" + response.body);
                return;
            }
        }
        const empleados = yield response.json();
        cargarTablaEmpleados(empleados);
    }
    catch (error) {
        console.error('Error al cargar empleados:', error);
    }
});
// Cargar los empleados al inicio
loadEmpleados();
// Función para manejar el evento de eliminar empleado
const deleteEmpleado = (id) => __awaiter(this, void 0, void 0, function* () {
    if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
        try {
            const jwt = sessionStorage.getItem('jsonWebToken');
            const response = yield fetch(`${apiEmpleados}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });
            if (response.status === 403) {
                authenticate();
            }
            if (response.ok) {
                loadEmpleados(); // Recargar la lista de empleados
            }
            else {
                alert('Error al eliminar el empleado');
            }
        }
        catch (error) {
            console.error('Error al eliminar el empleado:', error);
        }
    }
});
const editarEmpleado = (empleado) => __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    console.log(empleado);
    const modal = document.createElement('div');
    modal.setAttribute('id', 'modal');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContent.style.textAlign = 'center';
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const abrevs = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    for (let i = 0; i < diasSemana.length; i++) {
        const diaLabel = document.createElement('label');
        diaLabel.innerText = diasSemana[i];
        diaLabel.style.display = 'block';
        diaLabel.style.marginBottom = '8px';
        const diaInput = document.createElement('input');
        diaInput.setAttribute("id", `entrada_dia_${abrevs[i]}`);
        diaInput.type = 'time';
        const diaKey = abrevs[i];
        diaInput.value = empleado.horarios && ((_a = empleado.horarios[diaKey]) === null || _a === void 0 ? void 0 : _a.entradaDia) ? (_b = empleado.horarios[diaKey]) === null || _b === void 0 ? void 0 : _b.entradaDia : '';
        diaInput.name = 'entrada_dia';
        diaInput.style.marginBottom = '16px';
        diaInput.style.display = 'block';
        diaInput.required = false;
        const nocheInput = document.createElement('input');
        nocheInput.setAttribute("id", `entrada_noche_${abrevs[i]}`);
        nocheInput.type = 'time';
        nocheInput.value = empleado.horarios && ((_c = empleado.horarios[diaKey]) === null || _c === void 0 ? void 0 : _c.entradaNoche) ? (_d = empleado.horarios[diaKey]) === null || _d === void 0 ? void 0 : _d.entradaNoche : '';
        nocheInput.name = 'entrada_noche';
        nocheInput.style.marginBottom = '16px';
        nocheInput.style.display = 'block';
        nocheInput.required = false;
        modalContent.appendChild(diaLabel);
        modalContent.appendChild(diaInput);
        modalContent.appendChild(nocheInput);
    }
    const confirmButton = document.createElement('button');
    confirmButton.innerText = 'Confirmar';
    confirmButton.style.padding = '10px 20px';
    confirmButton.style.backgroundColor = '#4CAF50';
    confirmButton.style.color = '#fff';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '4px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        let horarios = {};
        for (let i = 0; i < diasSemana.length; i++) {
            let entradaDia = document.getElementById(`entrada_dia_${abrevs[i]}`).value;
            let entradaNoche = document.getElementById(`entrada_noche_${abrevs[i]}`).value;
            let undefs = 2;
            if (entradaDia !== "") {
                entradaDia = entradaDia.split(':')[0] + ':' + entradaDia.split(':')[1] + ':00';
                undefs--;
            }
            if (entradaNoche !== "") {
                entradaNoche = entradaNoche.split(':')[0] + ':' + entradaNoche.split(':')[1] + ':00';
                undefs--;
            }
            if (undefs < 2) {
                const diaSemana = abrevs[i];
                horarios = Object.assign(Object.assign({}, horarios), { [diaSemana]: {
                        entradaDia: entradaDia !== "" ? entradaDia : undefined,
                        entradaNoche: entradaNoche !== "" ? entradaNoche : undefined,
                        diaSemana
                    } });
            }
        }
        console.log(horarios);
        empleado.horarios = horarios;
        empleadoEditado(empleado);
    }));
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Cancelar';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = '16px';
    closeButton.addEventListener('click', () => modal.remove());
    modal.appendChild(modalContent);
    modalContent.appendChild(confirmButton);
    modalContent.appendChild(closeButton);
    document.body.appendChild(modal);
});
const empleadoEditado = (empleado) => __awaiter(this, void 0, void 0, function* () {
    var _a;
    const response = yield fetch(apiUrl + "/empleado/" + empleado.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${sessionStorage.getItem('jsonWebToken')}`
        },
        body: JSON.stringify(empleado),
    });
    console.log(empleado);
    (_a = document.getElementById('modal')) === null || _a === void 0 ? void 0 : _a.remove();
    if (response.ok) {
        alert("Empleado editado correctamente.");
    }
    else {
        alert("Error al editar empleado");
    }
    loadEmpleados();
});
// Función para generar el informe
const generateReport = (fechaInicio, fechaFin, id) => __awaiter(this, void 0, void 0, function* () {
    try {
        const jwt = sessionStorage.getItem('jsonWebToken');
        const endpoint = id ? `${apiEmpleados}/generarInforme/${id}` : `${apiEmpleados}/generarInforme`;
        const endpointQuery = `${endpoint}?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`;
        const response = yield fetch(endpointQuery, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        if (response.status === 403) {
            authenticate();
        }
        if (response.ok) {
            const blob = yield response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : (id ? 'report.xlsx' : 'reports.zip');
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
            loadEmpleados();
        }
        else {
            alert('Error al generar informe');
        }
    }
    catch (error) {
        console.error('Error al generar informe:', error);
    }
});
const generarModalFechas = (id) => __awaiter(this, void 0, void 0, function* () {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContent.style.textAlign = 'center';
    const fechaInicioLabel = document.createElement('label');
    fechaInicioLabel.innerText = 'Fecha Inicio:';
    fechaInicioLabel.style.display = 'block';
    fechaInicioLabel.style.marginBottom = '8px';
    const fechaInicioInput = document.createElement('input');
    fechaInicioInput.type = 'date';
    fechaInicioInput.name = 'fecha_inicio';
    fechaInicioInput.style.marginBottom = '16px';
    fechaInicioInput.style.display = 'block';
    fechaInicioInput.required = true;
    const fechaFinLabel = document.createElement('label');
    fechaFinLabel.innerText = 'Fecha Fin:';
    fechaFinLabel.style.display = 'block';
    fechaFinLabel.style.marginBottom = '8px';
    const fechaFinInput = document.createElement('input');
    fechaFinInput.type = 'date';
    fechaFinInput.name = 'fecha_fin';
    fechaFinInput.style.marginBottom = '16px';
    fechaFinInput.style.display = 'block';
    fechaFinInput.required = true;
    const confirmButton = document.createElement('button');
    confirmButton.innerText = 'Confirmar';
    confirmButton.style.padding = '10px 20px';
    confirmButton.style.backgroundColor = '#4CAF50';
    confirmButton.style.color = '#fff';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '4px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        const fechaInicio = fechaInicioInput.value;
        const fechaFin = fechaFinInput.value;
        generateReport(fechaInicio, fechaFin, id);
        modal.remove();
    }));
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Cancelar';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = '16px';
    closeButton.addEventListener('click', () => modal.remove());
    modal.appendChild(modalContent);
    modalContent.appendChild(fechaInicioLabel);
    modalContent.appendChild(fechaInicioInput);
    modalContent.appendChild(fechaFinLabel);
    modalContent.appendChild(fechaFinInput);
    modalContent.appendChild(confirmButton);
    modalContent.appendChild(closeButton);
    document.body.appendChild(modal);
});
// Función de autenticación
const authenticate = () => {
    const modal = document.createElement('div');
    modal.setAttribute('id', 'modal');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContent.style.textAlign = 'center';
    const usernameLabel = document.createElement('label');
    usernameLabel.innerText = 'Nombre:';
    usernameLabel.style.display = 'block';
    usernameLabel.style.marginBottom = '8px';
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.name = 'nombre';
    usernameInput.style.marginBottom = '16px';
    usernameInput.style.display = 'block';
    usernameInput.required = true;
    const passwordLabel = document.createElement('label');
    passwordLabel.innerText = 'Contraseña:';
    passwordLabel.style.display = 'block';
    passwordLabel.style.marginBottom = '8px';
    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.name = 'contraseña';
    passwordInput.style.marginBottom = '16px';
    passwordInput.style.display = 'block';
    passwordInput.required = true;
    const confirmButton = document.createElement('button');
    confirmButton.innerText = 'Confirmar';
    confirmButton.style.padding = '10px 20px';
    confirmButton.style.backgroundColor = '#4CAF50';
    confirmButton.style.color = '#fff';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '4px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.addEventListener('click', () => requestLogin(usernameInput.value, passwordInput.value)); // Cierra el modal
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Cancelar';
    closeButton.style.padding = '10px 20px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginLeft = '16px';
    closeButton.addEventListener('click', () => modal.remove());
    modal.appendChild(modalContent);
    modalContent.appendChild(usernameLabel);
    modalContent.appendChild(usernameInput);
    modalContent.appendChild(passwordLabel);
    modalContent.appendChild(passwordInput);
    modalContent.appendChild(confirmButton);
    modalContent.appendChild(closeButton);
    document.body.appendChild(modal);
};
// Función para manejar la autenticación
const requestLogin = (username, password) => __awaiter(this, void 0, void 0, function* () {
    var _a;
    sessionStorage.clear();
    if (!username || !password || username === '' || password === '') {
        alert("Por favor, introduce tu nombre de usuario y contraseña.");
        return;
    }
    const data = {
        nombre: username,
        password: password,
    };
    try {
        const response = yield fetch(apiUrl + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            const jwt = response.headers.get("Authorization");
            if (jwt) {
                sessionStorage.setItem("jsonWebToken", jwt);
                (_a = document.getElementById('modal')) === null || _a === void 0 ? void 0 : _a.remove();
                loadEmpleados();
            }
            else {
                alert("Token no recibido en los encabezados.");
            }
        }
        else {
            const errorMessage = yield response.text();
            alert("Credenciales incorrectas: " + errorMessage);
        }
    }
    catch (error) {
        console.error("Error al intentar autenticar:", error);
        alert("Hubo un error al intentar autenticarte. Intenta de nuevo.");
    }
});
