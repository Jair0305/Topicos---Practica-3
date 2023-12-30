/*

    Created: 2023-08-06
    Created by: Chavez Islas Jair
    Description: assigment 2

*/

const mongoose = require('mongoose');

const singerSchema = new mongoose.Schema({//Esquema o estructura requerida para singers
    name: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: String,
        required: true
    },
    albums: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    }]
});

const Singer = mongoose.model('Singer', singerSchema);

module.exports = Singer;//Se exporta el modelo hehco para la base de datos
