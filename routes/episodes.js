const express = require('express');
const moviesCallBacks = require('../controllers/episodes')
const router = express.Router();

/* GET one episode. */
router.get('/', moviesCallBacks.getOneEpisode);
/* POST one episode. Prior TVSHOW POST */
router.post('/', moviesCallBacks.postOneEpisode);

module.exports = router;
