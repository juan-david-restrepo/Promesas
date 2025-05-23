

// Importamos el módulo 'fs' con promesas para trabajar con archivos de forma asíncrona
const fs = require('fs').promises;

// Importamos 'path' para manejar rutas de archivos de forma segura y multiplataforma
const path = require('path');

/**
 * Función asíncrona que crea una cantidad determinada de archivos de texto
 * en una carpeta llamada 'archivos' dentro del directorio actual.
 * 
 * @param {number} cantidad - Número de archivos que se desean crear
 */
async function crearArchivos(cantidad) {
  // Construimos la ruta de la carpeta 'archivos' dentro del directorio actual
    const carpeta = path.join(__dirname, 'archivos');

    try {
    // Intentamos crear la carpeta 'archivos'
    await fs.mkdir(carpeta);
    } catch (error) {
    // Si la carpeta ya existe (error EEXIST), no hacemos nada
    // Si ocurre otro error, lo lanzamos para que sea manejado fuera
    if (error.code !== 'EEXIST') throw error;
    }

  // Creamos un arreglo para almacenar las promesas de escritura de archivos
    const promesas = [];

  // Generamos las promesas para crear cada archivo
    for (let i = 1; i <= cantidad; i++) {
    // Definimos el nombre del archivo, por ejemplo 'archivo_1.txt'
    const nombreArchivo = `archivo_${i}.txt`;
    // Construimos la ruta completa para cada archivo
    const rutaArchivo = path.join(carpeta, nombreArchivo);
    // Definimos el contenido que tendrá cada archivo
    const contenido = `Contenido del archivo número ${i}`;

    // Creamos la promesa de escritura y la agregamos al arreglo
    promesas.push(fs.writeFile(rutaArchivo, contenido));
    }

  // Esperamos a que todas las promesas de escritura se completen en paralelo
    await Promise.all(promesas);

  // Cuando termina, mostramos un mensaje en consola con la cantidad de archivos creados
    console.log(`Se crearon ${cantidad} archivos correctamente.`);
}

// Llamamos la función para crear 1000 archivos y manejamos posibles errores
crearArchivos(100)
    .catch(error => {
    console.error('Error al crear archivos:', error);
    });

