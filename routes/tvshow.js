const express = require('express');
const tvshowCallBacks = require('../controllers/tvshow')
const router = express.Router();

/* POST TVSHOW. This is needed before adding an episode */
router.post('/', tvshowCallBacks.postTvshow);
/* GET TVSHOWS listing. */
router.get('/', tvshowCallBacks.getTvshows);

module.exports = router;
