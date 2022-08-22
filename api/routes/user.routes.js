//importing the JWT middleware and Multer middleware
const { jwtMiddleware, multerMiddleware } = require("../middlewares")

//importing user.controller
const controller = require("../controllers/user.controller")

module.exports = function(app) {
    app.post("/api/user/addone", controller.addone) //add one user
    app.post("/api/user/signin", controller.signin) //singin
    app.get("/api/user/:id", [jwtMiddleware.verifyToken], controller.getone) //get one user
    app.get("/api/user/", [jwtMiddleware.verifyToken], controller.getall) //get all users
    app.delete("/api/user/:id", [jwtMiddleware.verifyToken], controller.deleteone) //delete one user
    app.put("/api/user/:id", [jwtMiddleware.verifyToken], multerMiddleware, controller.updateone) //update one user
}