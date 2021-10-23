const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title : {type: String} ,
    year : {type : String},
    runtime : {type : String},
    genres : {type : Array},
    imdbID : {type : String, unique: true},
    ratings : {type : String}, 
    directors : {type : String},
    actors : {type : String},
    posterUrl : {type : String}
});

movieSchema.index({
    imdbID : 1,
    ratings : -1
});

module.exports = mongoose.model('Movies', movieSchema);