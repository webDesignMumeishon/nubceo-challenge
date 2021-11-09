var express = require('express');
var router = express.Router();
//Routes middlewares
const moviesRouter = require('./movies')
const episodesRouter = require('./episodes')
const tvshowRouter = require('./tvshow')
const userRouter = require('./users')
//Models
const {Movie, Genre} = require("../db")
//validation jsw middleware
const {userValidation} = require('../controllers/validateUser')

//Route to create and log in user
router.use('/user', userRouter)
//Routes that need jwt
router.use('/movies', userValidation, moviesRouter)
router.use('/episodes',userValidation, episodesRouter)
router.use('/tvshow', userValidation, tvshowRouter)



module.exports = router;
