const host = "backend.horaspicoteo.duckdns.org";
const apiUrl = 'https://' + host;
const apiEmpleados = apiUrl + "/empleado" 

// Referencias de los elementos en el DOM
const empleadosTable = document.getElementById('empleados-table').getElementsByTagName('tbody')[0];
const empleadoForm = document.getElementById('empleado-form');
const empleadoIdInput = document.getElementById('empleado-id');
const empleadoNombreInput = document.getElementById('empleado-nombre');
const empleadoPasswordInput = document.getElementById('empleado-password');
document.getElementById('generar-informes-button').addEventListener('click', () => generarModalFechas());


// Función para cargar los empleados
const loadEmpleados = async () => {
  try {
    const jwt = sessionStorage.getItem('jsonWebToken');
    //console.log(jwt)
    const response = await fetch(apiEmpleados, {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    if (response.status === 403) {
      authenticate();
    }

    const empleados = await response.json();
    empleadosTable.innerHTML = ''; // Limpiar tabla antes de renderizar

    empleados.forEach(empleado => {
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
      document.getElementById(`delete-${empleado.id}`).addEventListener('click', () => deleteEmpleado(empleado.id));
      document.getElementById(`generar-informe-${empleado.id}`).addEventListener('click', () => generarModalFechas(empleado.id));
      document.getElementById(`edit-${empleado.id}`).addEventListener('click', () => editarEmpleado(empleado));
    });
  } catch (error) {
    console.error('Error al cargar empleados:', error);
  }
};

// Cargar los empleados al inicio
loadEmpleados();

// Función para manejar el evento de eliminar empleado
const deleteEmpleado = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
    try {
      const jwt = sessionStorage.getItem('jsonWebToken');
      const response = await fetch(`${apiEmpleados}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });

      if (response.status === 403) {
        authenticate();
      }

      if (response.ok) {
        alert('Empleado eliminado');
        loadEmpleados(); // Recargar la lista de empleados
      } else {
        alert('Error al eliminar el empleado');
      }
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
    }
  }
};

const editarEmpleado = async (empleado) => {
  
  console.log(empleado)
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

  const hora_entrada_dia_label = document.createElement('label');
  hora_entrada_dia_label.innerText = 'Hora entrada día:';
  hora_entrada_dia_label.style.display = 'block';
  hora_entrada_dia_label.style.marginBottom = '8px';

  const hora_entrada_dia_input = document.createElement('input');
  hora_entrada_dia_input.type = 'time';
  hora_entrada_dia_input.name = 'hora';
  hora_entrada_dia_input.style.marginBottom = '16px';
  hora_entrada_dia_input.style.display = 'block';
  hora_entrada_dia_input.required = false;
  if(empleado.entrada_dia != null){
    hora_entrada_dia_input.value = empleado.entrada_dia;
  }

  const hora_entrada_noche_label = document.createElement('label');
  hora_entrada_noche_label.innerText = 'Hora entrada noche:';
  hora_entrada_noche_label.style.display = 'block';
  hora_entrada_noche_label.style.marginBottom = '8px';

  const hora_entrada_noche_input = document.createElement('input');
  hora_entrada_noche_input.type = 'time';
  hora_entrada_noche_input.name = 'hora';
  hora_entrada_noche_input.style.marginBottom = '16px';
  hora_entrada_noche_input.style.display = 'block';
  hora_entrada_noche_input.required = false;
  if(empleado.entrada_noche != null){
    hora_entrada_noche_input.value = empleado.entrada_noche;
  }

  const confirmButton = document.createElement('button');
  confirmButton.innerText = 'Confirmar';
  confirmButton.style.padding = '10px 20px';
  confirmButton.style.backgroundColor = '#4CAF50';
  confirmButton.style.color = '#fff';
  confirmButton.style.border = 'none';
  confirmButton.style.borderRadius = '4px';
  confirmButton.style.cursor = 'pointer';

  confirmButton.addEventListener('click', () => empleadoEditado(empleado, hora_entrada_dia_input.value, hora_entrada_noche_input.value)); // Cierra el modal

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
  modalContent.appendChild(hora_entrada_dia_label);
  modalContent.appendChild(hora_entrada_dia_input);
  modalContent.appendChild(hora_entrada_noche_label);
  modalContent.appendChild(hora_entrada_noche_input);
  modalContent.appendChild(confirmButton);
  modalContent.appendChild(closeButton);

  document.body.appendChild(modal);

};

const empleadoEditado = async (empleado, hora_entrada_dia, hora_entrada_noche) => {
  
  empleado.entrada_dia = hora_entrada_dia ? hora_entrada_dia : empleado.entrada_dia;
  empleado.entrada_noche = hora_entrada_noche ? hora_entrada_noche  : empleado.entrada_noche;


  if(empleado.entrada_dia){
    const partesDia = empleado.entrada_dia.split(":")
    empleado.entrada_dia = `${partesDia[0]}:${partesDia[1]}:00`;
  }

  if(empleado.entrada_noche){
    const partesNoche = empleado.entrada_noche.split(":")
    empleado.entrada_noche = `${partesNoche[0]}:${partesNoche[1]}:00`;
  }


  const response = await fetch(apiUrl + "/empleado/" + empleado.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${sessionStorage.getItem('jsonWebToken')}`
    },
    body: JSON.stringify(empleado),
  });

  console.log(empleado);
  document.getElementById('modal').remove();

  if (response.ok) {
    alert("Empleado editado correctamente.");
  } else {
    alert("Error al editar empleado");
  }
  loadEmpleados();

};

const generateReport = async (id, fechaInicio, fechaFin) => {
  
  try {
  
    const jwt = sessionStorage.getItem('jsonWebToken');
    const endpoint = id ? `${apiEmpleados}/generarInforme/${id}` : `${apiEmpleados}/generarInforme`;
    const endpointQuery = `${endpoint}?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`;
    console.log(endpointQuery);
    const response = await fetch(endpointQuery, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`
      },
      query: {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
      }

    });

    if (response.status === 403) {
      authenticate();
    }

    if (response.ok) {
      
      // Parse the response as a Blob (binary data)
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : (id ? 'report.xlsx':'reports.zip'); // Default filename if header is missing

      // Create a link element to trigger the download
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;
      link.click(); // Trigger the download

      window.URL.revokeObjectURL(url); // Clean up the URL object

      loadEmpleados(); // Recargar la lista de empleados
    } else {
      alert('Error al generar informe');
    }

  } catch (error) {
    console.error('Error al generar informe:', error);
  }
};

const generarModalFechas = async (id) => {
  
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

  confirmButton.addEventListener('click', async () => {
    
    const fechaInicio = fechaInicioInput.value;
    const fechaFin = fechaFinInput.value;

    generateReport(id, fechaInicio, fechaFin);

    modal.remove();
  
  });

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

};

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
}

// Función para manejar el evento de autenticación
const requestLogin = async (username, password) => {
  
  sessionStorage.clear();
  
  if (!username || !password || username === '' || password === '') {
    alert("Por favor, introduce tu nombre de usuario y contraseña.");
    return;
  }

  // Crear el objeto de datos con el nombre de usuario y la contraseña
  const data = {
    nombre: username,
    password: password,
  };

  try {
    const response = await fetch(apiUrl + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Si la respuesta es exitosa (status 200-299)
    if (response.ok) {
      const jwt = response.headers.get("Authorization");
      if (jwt) {
        sessionStorage.setItem("jsonWebToken", jwt);
        document.getElementById('modal').remove();
        loadEmpleados(); // Recargar la lista de empleados
      } else {
        alert("Token no recibido en los encabezados.");
      }
    } else {
      const errorMessage = await response.text();
      alert("Credenciales incorrectas: " + errorMessage);
    }
  } catch (error) {
    console.error("Error al intentar autenticar:", error);
    alert("Hubo un error al intentar autenticarte. Intenta de nuevo.");
  }

};
