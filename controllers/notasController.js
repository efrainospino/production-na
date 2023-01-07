const { check, validationResult } = require('express-validator')
const mongoose = require('mongoose');
const fs = require('fs');

const Notas = require('../models/Notas');
const Usuarios = require('../models/Usuarios');

const multer = require('multer');
const shortid = require('shortid');

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) =>{
            cb(null, './uploads');
        },
        filename: (req, file, cb) =>{
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb){
        if( file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
            cb(null, true);
        }else{
            cb(new Error('Formato invalido'))
        }
    },
}
const upload = multer(configuracionMulter).single('image');

//subir imagen a la nota
exports.notaImagen = async (req, res, next) => {
    upload(req, res, function(error){
        if(error instanceof multer.MulterError){
            console.log('error', error);
            return next();
        }else if (error) {
            console.log('ocurrió un error');
            return next();
        }
        return next();
    })
}

//new nota
exports.nuevaNota = async (req, res, next) => {
    //validation
    await check('description').notEmpty().withMessage('La description es obligatoria').run(req);

    let resultado = validationResult(req);

    if(!resultado.isEmpty()){
        return res.send({
            errores: resultado.array(),
        })
    };

    const {title, description, userId} = req.body;

    var usuario = await Usuarios.findById(userId).exec();
    
    var newNota = new Notas({title, description, user: usuario._id});

    
    try {
        if(req.file?.filename){
            newNota.image = req.file.filename
        }
        //guardando usuario
        const savedNote = await newNota.save();
        usuario.notes.push(savedNote._id);
        await usuario.save();

        res.send({ mensaje: 'se creó la nota correctamente.'});
    } catch (error) {
        //si hay algun error console log y next
        console.log(error);
        next();
    }
};

//show all notas for (id)
exports.mostrarNotas = async (req, res, next) =>{
    try {
        const notas = await Notas.find({});

        res.json(notas);
    } catch (error) {
        console.log(error);
        next();
    }
};

//show nota for (ID)
exports.mostrarNota = async (req, res, next) =>{

    if (!mongoose.Types.ObjectId.isValid(req.params.idNota)){
        return res.json({ mensaje: `Esa nota no existe.` });
        next();
    };

    const nota = await Notas.findById(req.params.idNota).populate({path: 'user', select: 'nombre email'});
            
    //mostrar usuario
    res.json(nota);
};

//update nota (id)
exports.actualizarNota = async (req, res, next) => {

    try {
        const nota = await Notas.findOneAndUpdate({_id: req.params.idNota}, req.body, {
            new: true
        });
        //almacenar registro
        res.json(nota);
    } catch (error) {
        //si hay algun error console log y next
        console.log(error);
        next();
    }
};

//delete nota for (id)
exports.eliminarNota = async (req, res, next) => {

    try {
        const nota = await Notas.findById(req.params.idNota);
    
        fs.unlink(`./uploads/${nota.image}`, err => {
            if (err) {
              console.error(err);
            }
        });

        await Notas.findOneAndDelete({_id: req.params.idNota});

        await Usuarios.findByIdAndUpdate({_id: req.body.userId}, {
            $pull: {notes: {
                _id: req.params.idNota 
            }}
        });
        
        res.json({mensaje : 'La nota se eliminó correctamente.'});

    } catch (error) {
        //si hay algun error console log y next
        console.log(error);
        next();
    }
};

//eliminar foto
exports.eliminarImage = async (req, res, next) => {

    try {
        const nota = await Notas.findById(req.params.idNota);
    
        fs.unlink(`./uploads/${nota.image}`, err => {
            if (err) {
              console.error(err);
            }
        });

        await Notas.findByIdAndUpdate({_id: req.params.idNota}, {
            image: ''
        });
        
        res.json({mensaje : 'La image se eliminó correctamente.'});

    } catch (error) {
        //si hay algun error console log y next
        console.log(error);
        next();
    }
};
