const express = require('express');
const userCallBacks = require('../controllers/users')
const router = express.Router();

/* GET users listing. */
router.post('/', userCallBacks.postNewUser);
router.post('/token', userCallBacks.refreshToken);
router.get('/log', userCallBacks.logUser);
router.delete('/logout', userCallBacks.logOut);

module.exports = router;
