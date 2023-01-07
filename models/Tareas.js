const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tareasSchema = new Schema({
    description: {
        type: String,
        require: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'Usuarios'
    },
    realizado:{
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('Tareas', tareasSchema);