const nodemailer = require('nodemailer'); // esto llama a la libreria 

const tranportador = nodemailer.createTransport({ // le asigna createTransport a transportador
    service: 'gmail', 
    auth:{
        user: 'nodemailerenviar@gmail.com', // el correo desde el que se manda
        pass: 'zajn mmlm obzd mbsa', // contraseña o clave de confirmacion del correo
    }
})



function enviarCorreo(destino, asunto, mensaje){ // Función para enviar un correo a una persona
    const mailOpciones = {
        from: 'nodemailerenviar@gmail.com', // el correo desde el que se envia
        to: destino, // el destino
        subject: "Prueba de correo masivo", // titulo como tal del correo envido
        text: "Correo masivo de prueba" // lo que le aparece para leer a la persona
    }

    return tranportador.sendMail(mailOpciones);
}

const listaPersonas = [ // creo el array para almacenar los correos
    'davyz2006@gmail.com',
    'alencsalazar05@gmail.com',
    'quinterobrian2403@gmail.com',
    'betancurd862@gmail.com',
    'memfisguau@gmail.com'
]

const promesasEnvio = listaPersonas.map((email) =>{
    return enviarCorreo(email, 'correo masivoo', 'IMPORTANTE') // Para cada email en la lista, llame a la función enviarCorreo, que devuelve una promesa.
})


// cuando todas las promesas del arreglo se hayan resuelto o se rechaza si alguna falla.

Promise.all(promesasEnvio) // Uso Promise.all para esperar a que todas las promesas en promesasEnvio se resuelvan.

    .then((resultado =>{ // Cuando todas las promesas se resuelvan exitosamente
        console.log("todos los correo ya se enviaron")

        // Recorro ese arreglo para mostrar el resultado de cada envío.
        resultado.forEach(res,i => { // resultado es un arreglo con las respuestas de cada promesa (envío de correo).

            console.log(`Correo a ${listaPersonas[i]}: ${res.response}`) // Por cada respuesta, muestro a qué correo se envió y el mensaje de confirmación
        });
    }))
    .catch((error)=>{ // Si alguna promesa fall

        console.error("no se pudo enviar algun correo",error) // Muestro el error que ocurrió al intentar enviar alguno de los correos.
    })