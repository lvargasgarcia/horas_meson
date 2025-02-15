// const server = "https://backend.horaspicoteo.duckdns.org/"
const server = "http://localhost:8082/"

const registrateEvent = async (mode) => {
    
    generateModal(mode);

}

let latitude = null;
let longitude = null;

const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log("latitude: " + latitude + " longitude: " + longitude);
        });
    }
};

getLocation();

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

    const dniLabel = document.createElement('label');
    dniLabel.innerText = 'DNI:';
    dniLabel.style.display = 'block';
    dniLabel.style.marginBottom = '8px';

    const dniInput = document.createElement('input');
    dniInput.type = 'text';
    dniInput.name = 'dni';
    dniInput.style.marginBottom = '16px';
    dniInput.style.display = 'block';
    dniInput.required = true;

    if(mode === 0){
        modalContent.appendChild(dniLabel);
        modalContent.appendChild(dniInput);
    }

    const repeatPasswordLabel = document.createElement('label');
    repeatPasswordLabel.innerText = 'Repite la contraseña:';
    repeatPasswordLabel.style.display = 'block';
    repeatPasswordLabel.style.marginBottom = '8px';

    const repeatPasswordInput = document.createElement('input');
    repeatPasswordInput.type = 'password';
    repeatPasswordInput.name = 'repite_contraseña';
    repeatPasswordInput.style.marginBottom = '16px';
    repeatPasswordInput.style.display = 'block';
    repeatPasswordInput.required = true;
    
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

    confirmButton.addEventListener('click', () => {
        if(mode === 0 && passwordInput.value !== repeatPasswordInput.value) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        sendEventRequest(usernameInput.value, passwordInput.value, dniInput.value, mode);
    }); // Cierra el modal

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

    if(mode === 0) {
        modalContent.appendChild(dniLabel);
        modalContent.appendChild(dniInput);
    }

    modalContent.appendChild(usernameLabel);
    modalContent.appendChild(usernameInput);
    modalContent.appendChild(passwordLabel);
    modalContent.appendChild(passwordInput);

    if(mode === 0) {
        modalContent.appendChild(repeatPasswordLabel);
        modalContent.appendChild(repeatPasswordInput);
    }

    modalContent.appendChild(confirmButton);
    modalContent.appendChild(closeButton);

    document.body.appendChild(modal);
}


const sendEventRequest = async (username, password, dni, mode) => {
    
    if(!username || !password) {
        alert("Por favor, llena todos los campos.");
        return;
    }
    
    // Crear el objeto de datos a enviar
    const data = {
        nombre: username,
        password: password,
        dni: dni,
        latitud: latitude ? latitude : "no disponible",
        longitud: longitude ? longitude : "no disponible"
    };

    // Enviar los datos a la API usando fetch
    const endpoint = server + ((mode === 0) ? "empleado":"evento");
    console.log(endpoint);
    const response = await fetch(endpoint, {
        method: "POST", // Método HTTP
        headers: {
            "Content-Type": "application/json" // Indicamos que los datos se envían como JSON
        },
        body: JSON.stringify(data) // Convertimos el objeto en una cadena JSON
    });

    if (response.ok) {
        if(mode === 0){
            alert("Empleado registrado correctamente. Hora: " + new Date().toLocaleTimeString("es-ES"));
        }else{
            alert("Entrada/salida registrada correctamente. Hora: " + new Date().toLocaleTimeString("es-ES"));
        }
        document.getElementById("modal").remove();
    } else {
        const text = await response.text();
        alert("Hubo un problema con la solicitud: " + text);
    }

    // // Verificamos si la respuesta es exitosa
    // if (!response.ok) {
    //     let texto = "";
    //     response.body.tee((chunk) => {
    //         texto += chunk;
    //     });
    //     alert("Hubo un problema con la solicitud: " + texto);
    // }else{
    //     alert("Entrada/salida registrada correctamente. Hora: " + new Date().toLocaleTimeString("es-ES"));
    // }

    document.getElementById("modal").remove();
}


export default registrateEvent;