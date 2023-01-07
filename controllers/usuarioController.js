const { check, validationResult } = require('express-validator')
const Usuarios = require('../models/Usuarios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//agrega nuevo Usuario
exports.nuevoUsuario = async (req, res, next) => {
    //validation
    await check('nombre').notEmpty().isLength({min:3}).withMessage('El nombre debe tener minimo 3 caracteres').run(req);
    await check('email').isEmail().withMessage('Ese email no es valido').run(req);
    await check('password').isLength({min:6}).withMessage('La contraseña debe tener minimo 6 caracteres').run(req);
    await check('confirmarPassword').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req);

    let resultado = validationResult(req);

    //validar los campos del formulario
    if(!resultado.isEmpty()){
        return res.send({
            errores: resultado.array(),
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

    const {nombre, email, password} = req.body;

    //verificar que el usuario no este duplicado
    const existeUsuario = await Usuarios.findOne({email});
    if(existeUsuario){
        return res.send({
            errores: { mensaje: 'el usuario ya existe'},
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }
    
    //almacenar registro
    const usuario = new Usuarios({ nombre, email, password, token: ''});
    usuario.password = await bcrypt.hash(req.body.password, 12);

    try {
        //guardando usuario
        await usuario.save();
        res.json({ mensaje: 'se creó usuario correctamente'});
    } catch (error) {
        //si hay algun error console log y next
        console.log(error);
        next();
    }
}

//autenticar usuario
exports.autenticarUsuario = async (req, res, next) =>{
    //buscar usuario
    const usuario =  await Usuarios.findOne({ email: req.body.email });

    if(!usuario){
        await res.status(401).json({ mensaje: 'ese usuario no existe'});
        next();
    }else{
        if(!bcrypt.compareSync(req.body.password, usuario.password)){
            await res.status(401).json({ mensaje: 'contraseña incorrecta'});
            next();
        }else{
            const token = jwt.sign({
                email : usuario.email,
                nombre: usuario.nombre,
                id:     usuario._id
            },
            'LLAVEDEAUTENTICACION',
            {
                expiresIn: '5h'
            });
            const idUsuario = usuario._id;
            const user = usuario.nombre;
            res.json({token, idUsuario, user});
        }
    };
}

//mostrar todos los usuarios
exports.mostrarUsuarios = async (req, res, next) =>{
    try {
        const usuarios = await Usuarios.find({});

        res.json(usuarios);
    } catch (error) {
        console.log(error);
        next();
    }
}

//mostrar un usuario especifico (ID)
exports.mostrarUsuario = async (req, res, next) =>{

    if (!mongoose.Types.ObjectId.isValid(req.params.idUsuario)){
        return res.json({ mensaje: `Ese usuario no existe.` });
        next();
    };

    const usuario = await Usuarios.findById(req.params.idUsuario).select('nombre email token').populate({
        path: 'notes',
        populate: {
            path: '_id',
            model: 'Notas',
            select: 'title description image'
        }
    }).populate({
        path: 'tasks',
        populate: {
            path: '_id',
            model: 'Tareas',
            select: 'description realizado'
        }
    });
            
    //mostrar usuario
    res.json(usuario);
}

//actualizar usuario por (ID)
exports.actualizarUsuario = async (req, res, next) => {

    try {
        const usuario = await Usuarios.findOneAndUpdate({_id: req.params.idUsuario}, req.body, {
            new: true
        });
        //almacenar registro
        res.json(usuario);
    } catch (error) {
        //si hay algun error console log y next
        console.log(error);
        next();
    }
}

//eliminar usuario por (ID)
exports.eliminarUsuario = async (req, res, next) => {

    try {
        await Usuarios.findOneAndDelete({_id: req.params.idUsuario});
        res.json({mensaje : 'El usuario se eliminó correctamente.'});

    } catch (error) {
        //si hay algun error console log y next
        console.log(error);
        next();
    }
}