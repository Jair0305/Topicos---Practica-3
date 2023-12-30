/*

    Created: 2023-08-06
    Created by: Chavez Islas Jair
    Description: assigment 2

*/

const mongoose = require('mongoose');//Se agrega mongoose

const albumSchema = new mongoose.Schema({//Estructura de los atributos de album
    title: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
});

const Album = mongoose.model('Album', albumSchema);//Crea un modelo para la base de datos, para exportar

module.exports = Album;//Se exporta ese valor
