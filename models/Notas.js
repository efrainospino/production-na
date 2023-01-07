const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const notasSchema = new Schema({
    title: {
        type: String,
        maxlength: [ 30 ]
    },
    description: {
        type: String,
        require: true
    },
    image: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: 'Usuarios'
    }
});


module.exports = mongoose.model('Notas', notasSchema);