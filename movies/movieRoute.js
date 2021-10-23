const express = require('express');

const { getMoviesList, addMovie, authMiddleware,
         updateMovieByID, deleteMovieById, getMoviesByRatings } = require('./movieController')

const movieRoute = express.Router();

// get the complete list of movies
movieRoute.get('/list', getMoviesList);

// add a movie in the database.
movieRoute.post('/add', addMovie);

// update a movie after checking user authentication middleware
movieRoute.put('/auth/:authID/update/:imdbID', authMiddleware, updateMovieByID);

// delete the movie befor authentication
movieRoute.delete('/auth/:authID/delete/:imdbID', authMiddleware, deleteMovieById);

// getting custom data from db based on ratings
movieRoute.get('/rating/:_rating', getMoviesByRatings);

module.exports = movieRoute;