const express = require('express');

const movieRoute = require('./movies/movieRoute');

const router = express.Router();

router.use('/movies', movieRoute);

module.exports = router;