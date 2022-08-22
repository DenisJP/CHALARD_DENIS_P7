const jwt = require("jsonwebtoken")
const config = require("../config/jwt.config")

verifyToken = (req, res, next) => {
    let token = req.headers['authorization'].slice(7)
    if (!token){
        return res.status(403).send({ message: "JWT Token is not valid" })
    }
    jwt.verify(token, config.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "JWT Token is not valid" })
        }
        req.userId = decoded.id
        next()
    })
}
const authToken = {
    verifyToken
}
module.exports = authToken