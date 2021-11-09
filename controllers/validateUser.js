const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.userValidation = function (req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
    if(err) {
      return res.status(403).json({status: "error",message: err.message, data: null})
    } 
    else {
      // console.log(decoded);
      req.body.userId = decoded.id
      next()
    }
  })
}


exports.generateAccessToken = function(userId){
  console.log(userId);
  return jwt.sign({id: userId}, req.app.get('secretKey'), { expiresIn: '15s' }) 
}
