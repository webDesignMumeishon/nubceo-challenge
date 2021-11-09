const express = require('express');
const moviesCallBacks = require('../controllers/movies')
const router = express.Router();

/* GET movies listing. */
router.get('/', moviesCallBacks.getAllMovies);
/* POST a new movie. */
router.post('/', moviesCallBacks.postNewMovie);

module.exports = router;
