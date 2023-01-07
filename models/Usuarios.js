const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const usuariosSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        maxlength: [ 50, 'El nombre no puede exceder los 50 caracteres' ],
        minlength: [ 3, 'El npmbre debe contener 3 o más caracteres' ]
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    notes:[{
        note:{
            type: Schema.ObjectId,
            ref: 'Notas'
        },
    }],
    tasks:[{
        task:{
            type: Schema.ObjectId,
            ref: 'Tareas'
        },
    }],
    token: String,
    confirmado: Boolean
});


module.exports = mongoose.model('Usuarios', usuariosSchema);