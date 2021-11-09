const {Movie, Director, Genre, Actor, Episode, Tvshow, Season, User, Token} = require('../db')
const jwt = require('jsonwebtoken');
require('dotenv').config()
const {generateAccessToken} = require('./validateUser')


module.exports = {

  logUser: async (req, res) => {
    var { email, passwordInput } = req.body;

    //We search for the email if the user is in the db
    const userToValidate = await User.findOne({
      where: {
        email: email
      }
    });

    //in case the user is not found
    if (!userToValidate) return res.status(200).json(
      {
        message: "The email does not exist.",
        success: false
      }
    )

    try {
      if(Number(userToValidate.password) !== passwordInput) res.status(400).json({message: "The password is incorrect", success: false})

      //token is generated and sent to the user after successfully logging in
      const token = jwt.sign({ id: userToValidate.id}, req.app.get('secretKey'), { expiresIn: '100s' });
      //There is no expiration date, we are going to manually handle the expiration of the refrsh token
      const refreshToken = jwt.sign({ id: userToValidate.id}, process.env.REFRESH_TOKEN_SECRET);

      const createdTokenForUser = await Token.create({
        token: refreshToken
      })

      await userToValidate.setToken(createdTokenForUser)

      const response = {
        id: userToValidate.id,
        email: userToValidate.email,
        success: true,
        token: token,
        refreshToken: refreshToken, 
        message: "User successfully authenticated!"
      }
      return res.status(200).json(response)
    } 
    catch(err) {
      err => console.log(e)
    }
  },

  logOut: async (req, res) => {
    //deleting the token from Token table
    const result = await Token.destroy({
      where: {
        token: req.body.token
      }
    });

    if(result) return res.status(201).json({message: "Token was removed from database", success: true})

    return res.status(401).json({message: "The token wasn't deleted", success: false})

  },

  postNewUser: async (req, res) => {

    if(!req.body.email.length || !req.body.passwordInput){
      //email and password are mandatory to create a new user
      return res.status(400).json({message: "Missing arguments", success: false})
    }

    User.create({
      email: req.body.email,
      password: req.body.passwordInput
    })
    .then(user => {
      return res.status(201).json({data:user, message: "User successfully created", success: true})
    })
    .catch(err => {
      return res.status(400).json({message: err.errors, success: false})
    })

  },

  refreshToken: async (req, res) => {
    const refreshToken = req.body.token
    if(!refreshToken) return res.sendStatus(401)
    
    const findRefreshToken = await Token.findOne({
      where: {token: refreshToken}
    })
    if(!findRefreshToken) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,  (err, user) => {
      if(err) return res.sendStatus(403)
      const accessToken = jwt.sign({ id: user.id}, req.app.get('secretKey'), { expiresIn: '100s' });
      return res.status(201).json({token: accessToken })
    })

  }
  }





