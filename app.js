/*

    Created: 2023-08-06
    Created by: Chavez Islas Jair
    Description: assigment 2

*/

const singers = require('./routes/singer');//Se llaman los archivos necesarios, en este caso las rutas
const albums = require('./routes/album');
const songs = require('./routes/song');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/singers', singers);//Con los atributos ya antes declarados, se declaran estas rutas para usarse
app.use('/api/albums', albums);
app.use('/api/songs', songs);

mongoose.connect('mongodb://127.0.0.1/music')//Conexion con la base de datos
        .then(() => console.log("Conectado a mongodb"))
        .catch(err => console.log(`No se pudo conectar con mongoDB, ocrruio: ${err}`))

const port = process.env.PORT || 3000;//Conexion con el puertos
app.listen(port, () => {
    console.log(`API RESTful en puerto ${port} y ejecutandose`);
});

