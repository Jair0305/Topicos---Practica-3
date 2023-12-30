/*

    Created: 2023-08-06
    Created by: Chavez Islas Jair
    Description: assigment 2

*/

const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({//EStructura de los datos que debe llevar las cacniones
    name: {
        type: String,
        required: true
    },
    length: {
        type: String,
        required: true
    },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;//Se exporta el modelo para la base de datos
