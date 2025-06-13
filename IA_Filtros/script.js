async function IAPrueba() {
    const preguntaCaja = document.getElementById('preguntaCaja').value;

    const respuestaContainer = document.getElementById('respuestaContainer')

    const apiKeyGemini = "AIzaSyDkbcLz26chPE-MpiDq4fTlYSjb8gcLdqs";

    const loader = document.getElementById('loader');

    if (!preguntaCaja.trim()) {
        respuestaContainer.textContent = "Por favor, ingresa algún texto.";
        return;
    }

    respuestaContainer.textContent = "";
    loader.style.display = 'block';

    const API_URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKeyGemini}`;

        const requestBodyGemini = {
        contents: [
            { parts: [
                { text:'solo responde si la frase o palabra es positivo o negativo' + preguntaCaja  }
            ] }
        ]
    };

    try {

       const respuestaGemini = await fetch(API_URL_GEMINI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBodyGemini)
        });

        if (!respuestaGemini.ok) {
            const errorData2 = await respuestaGemini.json();
            respuestaContainer.textContent = `Error Gemini: ${respuestaGemini.status} - ${errorData2.error?.message || 'Error desconocido'}`;
        } else {
            const data2 = await respuestaGemini.json();
            console.log("Respuesta Gemini:", data2);
            const part = data2.candidates?.[0]?.content?.parts?.[0]?.text;
            respuestaContainer.textContent = part || "Respuesta vacía de Gemini.";
        }

        
    } catch (error) {
        console.error("Error en la solicitud fetch:", error);
        respuestaContainer.textContent = "Error al conectar la IA"
    }finally {
        loader.style.display = 'none';
        preguntaCaja.textContent = "";

    }
    
}