async function enviarIA() {
    const inputText = document.getElementById('inputText').value;
    const responseContainer = document.getElementById('responseContainer');
    const responseContainer2 = document.getElementById('responseContainer2');
    const responseContainer3 = document.getElementById('responseContainer3');
    const loader = document.getElementById('loader');

    const apiKeyMistral = "WdpYhNUwvVck7A6KjUnHR2j5DAZP1tQ5";
    const apiKeyGemini = "AIzaSyDkbcLz26chPE-MpiDq4fTlYSjb8gcLdqs";
    const apiKeyHF = "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";

    if (!inputText.trim()) {
        responseContainer.textContent = "Por favor, ingresa algún texto.";
        responseContainer2.textContent = "Por favor, ingresa algún texto.";
        responseContainer3.textContent = "Por favor, ingresa algún texto.";
        return;
    }

    responseContainer.textContent = "";
    responseContainer2.textContent = "";
    responseContainer3.textContent = "";
    loader.style.display = 'block';

    const API_URL_MISTRAL = `https://api.mistral.ai/v1/chat/completions`;
    const API_URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKeyGemini}`;
    const API_URL_HF = `https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta`;

    const requestBodyMistral = {
        model: "mistral-medium",
        messages: [{ role: "user", content: inputText }]
    };

    const requestBodyGemini = {
        contents: [{ parts: [{ text: inputText }] }]
    };

    const requestBodyHF = {
        inputs: inputText,
        parameters: {
            max_new_tokens: 150,
            temperature: 0.7
        }
    };

    try {
        const [responseMistral, responseGemini, responseHF] = await Promise.all([
            fetch(API_URL_MISTRAL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKeyMistral}`
                },
                body: JSON.stringify(requestBodyMistral)
            }),

            fetch(API_URL_GEMINI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBodyGemini)
            }),

            fetch(API_URL_HF, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKeyHF}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBodyHF)
            })
        ]);

        // Mistral
        if (!responseMistral.ok) {
            const errorData = await responseMistral.json();
            responseContainer.textContent = `Error Mistral: ${responseMistral.status} - ${errorData.error?.message || 'Error desconocido'}`;
        } else {
            const data = await responseMistral.json();
            console.log("Respuesta Mistral:", data);
            responseContainer.textContent = data.choices?.[0]?.message?.content || "Respuesta vacía de Mistral.";
        }

        // Gemini
        if (!responseGemini.ok) {
            const errorData2 = await responseGemini.json();
            responseContainer2.textContent = `Error Gemini: ${responseGemini.status} - ${errorData2.error?.message || 'Error desconocido'}`;
        } else {
            const data2 = await responseGemini.json();
            console.log("Respuesta Gemini:", data2);
            const part = data2.candidates?.[0]?.content?.parts?.[0]?.text;
            responseContainer2.textContent = part || "Respuesta vacía de Gemini.";
        }

        // Zephyr-7B-beta
        const hfText = await responseHF.text();
        if (!responseHF.ok) {
            responseContainer3.textContent = `Error Zephyr: ${responseHF.status} - ${hfText}`;
        } else {
            try {
                const parsed = JSON.parse(hfText);
                if (parsed.generated_text) {
                    responseContainer3.textContent = parsed.generated_text;
                } else {
                    responseContainer3.textContent = "Zephyr respondió, pero no hubo texto generado.";
                }
            } catch (e) {
                responseContainer3.textContent = "Error al interpretar la respuesta de Zephyr.";
            }
        }

    } catch (error) {
        console.error("Error en la solicitud fetch:", error);
        responseContainer.textContent = "Error al conectar con Mistral.";
        responseContainer2.textContent = "Error al conectar con Gemini.";
        responseContainer3.textContent = "Error al conectar con Zephyr.";
    } finally {
        loader.style.display = 'none';
    }
}
