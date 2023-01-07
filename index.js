const express = require('express');
const routes = require('./routes');
const multer = require('multer');
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({ path: 'variables.env' });

//cors permite que un cliente se conecte a otro servidor
const cors = require('cors');

//conectar mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
});

//crear servidor 
const app = express();

//habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//habilitar uploads
app.use('/uploads', express.static('uploads'));

//habilitar cors
app.use(cors());

//rutas de la app 
app.use('/', routes());


//puerto
app.listen(5001);

