const ErrorHandler = require("../utils/errorHandler")

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500
    error.message = error.message || 'internal server error'

   // mongoDB id mismatch error
   if(error.name === 'CastError') {
    const message = `Resources not found. Invalid: ${error.path} `
    error = new ErrorHandler(message, 400)
   }

   // mongoose dublicate key error
   if(error.code === 11000) {
    const message = `Duplicate ${Object.keys(error.keyValue)}`
    error = new ErrorHandler(message, 400)
   }

   // wrong json error
   if(error.name === 'JsonWebTokenError') {
    const message = `Json Web Token is invalid, try again`
    error = new ErrorHandler(message, 400)
   }

   // jwt expire error
   if(error.name === 'TokenExpiredError') {
    const message = `Json Web Token is expired, try again`
    error = new ErrorHandler(message, 400)
   }
   
     res.status(error.statusCode).json({
        success: false,
        message: error.message 
    })
}