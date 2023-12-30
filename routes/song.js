/*

    Created: 2023-08-06
    Created by: Chavez Islas Jair
    Description: assigment 2

*/

const express = require('express');
const ruta = express.Router();
const Song = require('../models/songs_model');
const Joi = require('joi');

// Ruta para obtener todas las canciones o una canción por su ID
ruta.get('/:songId?', async (req, res) => {
    const { songId } = req.params;

    if (songId) {
        // Buscar una canción por su ID
        const song = await Song.findById(songId);

        if (song) {
            res.send(song);
        } else {
            res.status(404).send('No se encontró ese id en el registro');
        }
    } else {
        // Obtener todas las canciones
        const songs = await Song.find();
        res.send(songs);
    }
});

// Ruta para crear una nueva canción
ruta.post('/', (req, res) => {
    const body = req.body;
    const result = createSong(body);

    result
        .then(song => {
            res.send({
                value: song
            });
        })
        .catch(err => {
            res.status(404).send(err);
        });
});

// Ruta para actualizar los datos de una canción por su ID
ruta.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const result = updateSong(id, body);

    result
        .then(song => {
            res.send(song);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Ruta para eliminar una canción por su ID
ruta.delete('/:id', (req, res) => {
    const id = req.params.id;
    const result = deleteSong(id);

    result
        .then(song => {
            res.send(song);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Funciones

// Función para crear una nueva canción en la base de datos
async function createSong(body) {
    const { error, value } = schema.validate(body);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const song = new Song({
        name: value.name,
        length: value.length
    });

    return await song.save();
}

// Función para actualizar los datos de una canción en la base de datos por su ID
async function updateSong(id, body) {
    const { error, value } = schema.validate(body);

    if (error) {
        throw new Error(error.details[0].message);
    }

    const song = await Song.findByIdAndUpdate(
        id,
        {
            $set: {
                name: value.name,
                length: value.length
            }
        },
        { new: true }
    );

    return song;
}

// Función para eliminar una canción de la base de datos por su ID
async function deleteSong(id) {
    const song = await Song.findByIdAndRemove(id);
    return song;
}

// Esquema de validación con Joi para los datos de la canción
const schema = Joi.object({
    name: Joi.string().min(3).required(),
    length: Joi.string().pattern(/^[0-9]{2}:[0-9]{2}$/)
});

module.exports = ruta;
