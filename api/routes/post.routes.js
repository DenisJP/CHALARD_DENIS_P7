//importiung the JWT middleware and Multer middleware
const { jwtMiddleware, multerMiddleware } = require("../middlewares")

//importing post.controller
const controller = require("../controllers/post.controller")

module.exports = function(app) {
    app.get("/api/post", [jwtMiddleware.verifyToken], controller.getall) //get all posts
    app.get("/api/post/:id", [jwtMiddleware.verifyToken], controller.getone) //get all posts
    app.delete("/api/post/:id",[jwtMiddleware.verifyToken], controller.deleteone) //delete one post
    app.post("/api/post", [jwtMiddleware.verifyToken], multerMiddleware, controller.addone) //add one post
    app.put("/api/post/:id", [jwtMiddleware.verifyToken], multerMiddleware, controller.updateone) //update one post
    app.post("/api/post/:id/voteone", [jwtMiddleware.verifyToken], controller.voteone) //vote one post
}