//importing middleware
const jwtMiddleware = require('./middleware.jwt')
const multerMiddleware = require('./middleware.multer')

module.exports = {
    jwtMiddleware,
    multerMiddleware
}