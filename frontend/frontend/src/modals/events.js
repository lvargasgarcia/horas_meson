const registrateEvent = async (mode) => {
    
    generateModal(mode);

}

const generateModal = (mode) => {
    
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

    confirmButton.addEventListener('click', () => sendEventRequest(usernameInput.value, passwordInput.value, mode)); // Cierra el modal

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


const sendEventRequest = (username, password, mode) => {
    
    if(!username || !password) {
        alert("Por favor, llena todos los campos.");
        return;
    }
    
    // Crear el objeto de datos a enviar
    const data = {
        nombre: username,
        password: password,
    };

    // Enviar los datos a la API usando fetch
    fetch("http://localhost:8080/" + ((mode === 0) ? "empleado":"evento"), {
        method: "POST", // Método HTTP
        headers: {
            "Content-Type": "application/json" // Indicamos que los datos se envían como JSON
        },
        body: JSON.stringify(data) // Convertimos el objeto en una cadena JSON
    })
    .then(response => {
        // Verificamos si la respuesta es exitosa
        if (!response.ok) {
            throw new Error("Hubo un problema con la solicitud: " + response.statusText);
        }
        return response.json(); // Parseamos la respuesta como JSON
    })
    .then(data => {
        (mode === 0) ? alert("Usuario registrado exitosamente."):alert("Entrada/Salida añadida.");
    })
    .catch(error => {
        // En caso de error
        alert("Error al enviar los datos. Intenta de nuevo.");
        console.error("Error:", error);
    });
    document.getElementById("modal").remove();
}


export default registrateEvent;