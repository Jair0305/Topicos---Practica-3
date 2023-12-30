/*

    Created: 2023-08-06
    Created by: Chavez Islas Jair
    Description: assigment 2

*/

const express = require('express');
const ruta = express.Router();
const Album = require('../models/albums_model');
const Joi = require('joi');

// Obtener todos los álbumes o un álbum específico por ID
ruta.get('/:albumId?', async (req, res) => {
    const { albumId } = req.params;

    if (albumId) {
        // Buscar un álbum por su ID
        const album = await Album.findById(albumId);

        if (album) {
            res.send(album);
        } else {
            res.status(404).send('No se encontró ese id en el registro');
        }
    } else {
        // Obtener todos los álbumes
        const albums = await Album.find();
        res.send(albums);
    }
});

// Crear un nuevo álbum
ruta.post('/', (req, res) => {
    const body = req.body;
    const result = createAlbum(body);

    result
        .then(album => {
            res.send({
                value: album
            });
        })
        .catch(err => {
            res.status(400).send(err.message);
        });
});

// Actualizar un álbum existente por ID
ruta.put('/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const result = updateAlbum(id, body);

    result
        .then(album => {
            res.send(album);
        })
        .catch(err => {
            res.status(400).send(err.message);
        });
});

// Eliminar un álbum por ID
ruta.delete('/:id', (req, res) => {
    const id = req.params.id;
    const result = deleteAlbum(id);

    result
        .then(album => {
            res.send(album);
        })
        .catch(err => {
            res.status(400).send(err.message);
        });
});

// Operaciones de canciones en álbumes

// Agregar una canción a un álbum específico
ruta.post('/:albumId/addsong', async (req, res) => {
    const albumId = req.params.albumId;
    const song = req.body;

    try {
        const result = await addSongToAlbum(albumId, song);
        res.send(result);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Obtener todas las canciones de un álbum o una canción específica por ID de álbum y canción
ruta.get('/:albumId/songs/:songId?', async (req, res) => {
    const { albumId, songId } = req.params;

    try {
        const album = await Album.findById(albumId).populate('songs');

        if (!album) {
            return res.status(404).send('No se encontró ese id de álbum en el registro');
        }

        if (songId) {
            // Buscar una canción en el álbum por su ID
            const song = album.songs.find(song => song._id.toString() === songId);

            if (!song) {
                return res.status(404).send('No se encontró ese id de canción en el álbum');
            }

            return res.send(song);
        } else {
            // Obtener todas las canciones del álbum
            return res.send(album.songs);
        }
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

// Eliminar una canción de un álbum por ID de álbum y canción
ruta.delete('/:albumId/songs/:songId', async (req, res) => {
    const { albumId, songId } = req.params;

    try {
        const album = await Album.findById(albumId);

        if (!album) {
            return res.status(404).send('No se encontró ese id de álbum en el registro');
        }

        const songIndex = album.songs.findIndex(song => song._id.toString() === songId);

        if (songIndex === -1) {
            return res.status(404).send('No se encontró ese id de canción en el álbum');
        }

        // Eliminar la canción del array de canciones del álbum
        album.songs.splice(songIndex, 1);
        await album.save();

        return res.send(album);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});

// Funciones auxiliares

// Crear un nuevo álbum
async function createAlbum(body) {
    const { error, value } = schema.validate(body);

    if (error) {
        throw new Error(error.details[0].message);
    }

    // Crear una instancia del modelo Album con los valores proporcionados
    const album = new Album({
        title: value.title,
        label: value.label,
        genre: value.genre,
        year: value.year
    });

    // Guardar el álbum en la base de datos
    return await album.save();
}

// Actualizar un álbum existente
async function updateAlbum(id, body) {
    const { error, value } = schema.validate(body);

    if (error) {
        throw new Error(error.details[0].message);
    }

    // Buscar y actualizar el álbum por su ID
    const album = await Album.findByIdAndUpdate(id, {
        $set: {
            title: value.title,
            label: value.label,
            genre: value.genre,
            year: value.year
        }
    }, { new: true });

    return album;
}

// Eliminar un álbum por su ID
async function deleteAlbum(id) {
    const album = await Album.findByIdAndRemove(id);
    return album;
}

// Agregar una canción a un álbum
async function addSongToAlbum(albumId, song) {
    const album = await Album.findById(albumId);

    if (!album) {
        throw new Error('No se encontró el álbum especificado');
    }

    // Crear una instancia del modelo Song con los valores proporcionados
    const newSong = new Song({
        name: song.name,
        length: song.length,
        album: albumId
    });

    // Guardar la canción en la base de datos
    await newSong.save();

    // Agregar la canción al array de canciones del álbum
    album.songs.push(newSong._id);
    await album.save();

    return album;
}

// Definir el esquema de validación para los datos del álbum
const schema = Joi.object({
    title: Joi.string().min(3).required(),
    label: Joi.string().min(3).required(),
    genre: Joi.string().min(3).required(),
    year: Joi.string().pattern(/^\d{4}$/).required()
});

module.exports = ruta;
