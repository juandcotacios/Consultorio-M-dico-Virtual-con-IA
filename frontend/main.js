// Acceso a la cámara en tiempo real
const video = document.getElementById('video');

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
        video.srcObject = stream;
    })
    .catch(function (error) {
        console.log("Algo salió mal al intentar acceder a la cámara: " + error);
    });
}

document.querySelector(".send-button").addEventListener("click", async () => {
    const userInput = document.getElementById("user-input").value;

    // Verifica que hay un mensaje para enviar
    if (!userInput) {
        console.log("El campo de mensaje está vacío.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/consultar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userInput })
        });

        // Verifica si la respuesta no es OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Intenta convertir la respuesta a JSON
        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        // Manejar la respuesta y mostrarla en el frontend
        const responseContainer = document.getElementById("response-container");
        responseContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevas respuestas

        data.forEach(item => {
            const responseParagraph = document.createElement("p");
            responseParagraph.innerText = item.response || item.error || "No se recibió una respuesta válida.";
            responseContainer.appendChild(responseParagraph);
        });

    } catch (error) {
        console.error("Error al enviar el mensaje:", error);
    }
});

