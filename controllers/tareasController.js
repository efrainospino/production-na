const { check, validationResult } = require('express-validator')
const Tareas = require('../models/Tareas');
const Usuarios = require('../models/Usuarios');
const mongoose = require('mongoose');


//new nota
exports.nuevaTarea = async (req, res, next) => {
    //validation
    await check('description').notEmpty().withMessage('La description es obligatoria').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.send({
            errores: resultado.array(),
        })
    };

    const {description, userId} = req.body;

    const usuario = await Usuarios.findById(userId).exec();

    const newTarea = new Tareas({description, user: usuario._id});

    try {
        //guardando tarea
        const savedTarea = await newTarea.save();
        usuario.tasks.push(savedTarea._id);
        await usuario.save();
        
        res.json({ mensaje: 'se creó la tarea correctamente.'});
    } catch (error) {
        //si hay algun error console log y next
        console.log(error);
        next();
    }

};

//show all notas for (id)
exports.mostrarTareas = async (req, res, next) =>{
    try {
        const tareas = await Tareas.find({});

        res.json(tareas);
    } catch (error) {
        console.log(error);
        next();
    }
};

//show nota for (ID)
exports.mostrarTarea = async (req, res, next) =>{

    if (!mongoose.Types.ObjectId.isValid(req.params.idTarea)){
        return res.json({ mensaje: `Esa Tarea no existe.` });
        next();
    };

    const tarea = await Tareas.findById(req.params.idTarea).populate({path: 'user', select: 'nombre email'});;
            
    //mostrar usuario
    res.json(tarea);
};

//update nota (id)
exports.actualizarTarea = async (req, res, next) => {

    const {description, realizado} = req.body
    console.log(req.body)

    try {
        const tarea = await Tareas.findOneAndUpdate({_id: req.params.idTarea}, {description, realizado}, {
            new: true
        });
        //almacenar registro
        res.json(tarea);
    } catch (error) {
        //si hay algun error console log y next
        console.log(error);
        next();
    }
};

//delete nota for (id)
exports.eliminarTarea = async (req, res, next) => {

    try {
        await Tareas.findOneAndDelete({_id: req.params.idTarea});

        await Usuarios.findByIdAndUpdate({_id: req.body.userId}, {
            $pull: {tasks: {
                _id: req.params.idTarea
            }}
        });

        res.json({mensaje : 'La tarea se eliminó correctamente.'});

    } catch (error) {
        //si hay algun error console log y next
        console.log(error);
        next();
    }
};