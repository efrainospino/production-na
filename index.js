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

//definir dominios
const whiteList = [process.env.FRONTEND_URL]
const corsOptions ={
    origin: (origin, callback) => {
        //revisar si la peticion viene de un servidor que esta en la whiteList
        const existe = whiteList.some(dominio => dominio === origin);
        if(existe){
            callback(null, true);
        }else{
            callback(new Error ('No permitido por CORS'));
        }
    }
}

//habilitar cors
app.use(cors(corsOptions));

//rutas de la app 
app.use('/', routes());

//puerto y host
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5001
//iniciar app
app.listen(port, host, () =>{
    console.log('el servidor esta funcionando');
});

