const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');
const notasController = require('../controllers/notasController');
const tareasController = require('../controllers/tareasController');



//middleware para proteger rutas
const auth = require('../middleware/auth');



module.exports = function(){

    //agrega nuevos usuarios via POST
    router.post('/usuarios/add', usuarioController.nuevoUsuario);

    //autenticar usuario via POST
    router.post('/usuarios/autenticar', usuarioController.autenticarUsuario);

    //obtener todos los usuarios
    router.get('/usuarios',
        auth,
        usuarioController.mostrarUsuarios
    );

    //obtener usuario en especifico (ID)
    router.get('/usuarios/:idUsuario',
        auth,
        usuarioController.mostrarUsuario
    );

    //actualizar un usuario por (ID)
    router.put('/usuarios/:idUsuario',
        auth,
        usuarioController.actualizarUsuario
    );

    //Eliminar un usuario por (ID)
    router.delete('/usuarios/:idUsuario', 
        auth,
        usuarioController.eliminarUsuario
    );

    // ------ notas router ---->

    //agrega nueva nota via POST
    router.post('/notas/add', 
    auth,
    notasController.notaImagen,
    notasController.nuevaNota);

    //obtener todas las notas
    router.get('/notas',
        auth,
        notasController.mostrarNotas
    );

    //obtener nota en especifico (ID)
    router.get('/notas/:idNota',
        auth,
        notasController.mostrarNota
    );

    //actualizar una nota por (ID)
    router.put('/notas/:idNota',
        auth,
        notasController.actualizarNota
    );

    //Eliminar una nota por (ID)
    router.delete('/notas/:idNota', 
        auth,
        notasController.eliminarNota
    );

    //Eliminar una imagen de la nota (ID)
    router.put('/notas/image/:idNota', 
        auth,
        notasController.eliminarImage
    );

    // ------ tareas router ---->


    //agrega nueva nota via POST
    router.post('/tareas/add',
        auth,
        tareasController.nuevaTarea);

    //obtener todas las notas
    router.get('/tareas',
        auth,
        tareasController.mostrarTareas
    );

    //obtener nota en especifico (ID)
    router.get('/tareas/:idTarea',
        auth,
        tareasController.mostrarTarea
    );

    //actualizar una nota por (ID)
    router.put('/tareas/:idTarea',
        auth,
        tareasController.actualizarTarea
    );

    //Eliminar una nota por (ID)
    router.delete('/tareas/:idTarea', 
        auth,
        tareasController.eliminarTarea
    );



    return router;
}