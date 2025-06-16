// Función principal que obtiene el clima de Medellín usando dos APIs distintas
function obtenerClima() {
    // Primera API: Open-Meteo
    // Hacemos una petición HTTP con fetch para obtener el clima actual
    // de Medellín pasando latitud y longitud en la URL
    const openMeteo = fetch("https://api.open-meteo.com/v1/forecast?latitude=6.2518&longitude=-75.5636&current_weather=true")
    .then(res => res.json()) // Convertimos la respuesta a JSON
    .then(data => ({
        // Creamos un objeto con la fuente y la temperatura que nos interesa mostrar
        fuente: "Open-Meteo",
        temperatura: data.current_weather.temperature // Temperatura actual en °C
    }));

    // Segunda API: WeatherAPI (requiere API key)
    // Define la clave API que obtienes registrándote en weatherapi.com
    const weatherApiKey = "3fa1d8d858e146e8bf643555252305"; 

    // Petición HTTP a WeatherAPI con la clave y la ciudad 'Medellin'
    const weatherAPI = fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=Medellin`)
    .then(res => res.json()) // Convertimos la respuesta a JSON
    .then(data => ({
        // Creamos un objeto con la fuente y la temperatura que nos interesa mostrar
        fuente: "WeatherAPI",
      temperatura: data.current.temp_c // Temperatura actual en °C
    }));

    // Usamos Promise.race para iniciar ambas peticiones al mismo tiempo
    // y quedarnos con la que responda primero
    Promise.race([openMeteo, weatherAPI])
    .then(info => {
        // info es el objeto que nos llegó de la API más rápida
        // Mostramos en consola la fuente y temperatura obtenidas
        console.log(`Fuente: ${info.fuente} | Temperatura: ${info.temperatura} °C`);
    })
    .catch(error => {
        // Si ocurre cualquier error en alguna petición, lo mostramos en consola
        console.error("Error obteniendo el clima:", error);
    });
}

// Llamamos a la función para iniciar la consulta
obtenerClima();