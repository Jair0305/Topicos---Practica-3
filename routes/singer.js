/*

    Created: 2023-08-06
    Created by: Chavez Islas Jair
    Description: assigment 2

*/

const express = require('express');
const ruta = express.Router();
const Singer = require('../models/singers_model');
const Joi = require('joi');
const Album = require('../models/albums_model');

// Ruta para obtener todos los cantantes o un cantante por su ID
ruta.get('/:singerId?', async (req, res) => {
    const { singerId } = req.params;

    if (singerId) {
        // Buscar un cantante por su ID en la colección de álbumes (posible error en la lógica)
        const singer = await Album.findById(singerId);

        if (singer) {
            res.send(singer);
        } else {
            res.status(404).send('No se encontró ese id en el registro');
        }
    } else {
        // Obtener todos los cantantes
        const singers = await Singer.find();
        res.send(singers);
    }
});

// Ruta para crear un nuevo cantante
ruta.post('/', (req, res) => {
    const body = req.body;
    const result = createSinger(body);

    result
        .then(singer => {
            res.send({
                value: singer
            });
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

// Ruta para actualizar los datos de un cantante por su ID
ruta.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const result = updateSinger(id, body);

    result
        .then(singer => {
            res.send(singer);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Ruta para eliminar un cantante por su ID
ruta.delete('/:id', (req, res) => {
    const id = req.params.id;
    const result = deleteSinger(id);

    result
        .then(singer => {
            res.send(singer);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Funciones

// Función para crear un nuevo cantante en la base de datos
async function createSinger(body) {
    const { error, value } = schema.validate(body);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const singer = new Singer({
        name: value.name,
        nationality: value.nationality,
        date_of_birth: value.date_of_birth
    });

    return await singer.save();
}

// Función para actualizar los datos de un cantante en la base de datos por su ID
async function updateSinger(id, body) {
    const { error, value } = schema.validate(body);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const singer = await Singer.findByIdAndUpdate(
        id,
        {
            $set: {
                name: value.name,
                nationality: value.nationality,
                date_of_birth: value.date_of_birth
            }
        },
        { new: true }
    );

    return singer;
}

// Función para eliminar un cantante de la base de datos por su ID
async function deleteSinger(id) {
    const singer = await Singer.findByIdAndRemove(id);
    return singer;
}

// Esquema de validación con Joi para los datos del cantante
const schema = Joi.object({
    name: Joi.string().min(3).required(),
    nationality: Joi.string().min(3).required(),
    date_of_birth: Joi.string().pattern(/^(\d{4})\/(\d{2})\/(\d{2})$/).required()
});

module.exports = ruta;
