//importing JWT config file
const config = require("../config/jwt.config")

//importing models index file
const db = require("../models")

//importing file manager library
const fs = require('fs')

//getting the user schema
const User = db.user

//importing security library
let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')

//ADD ONE
exports.addone = (req, res) => {
    console.log("\x1b[35m%s\x1b[0m", "::user.controller.addone")

    //verifying input
    if(!req.body.username) {res.status(500).send({ message: "username can not be empty" }); return}
    if(!req.body.email) {res.status(500).send({ message: "email can not be empty" }); return}
    if(!req.body.password) {res.status(500).send({ message: "password can not be empty" }); return}
    if(req.body.password != req.body.passwordVerification) {res.status(500).send({ message: "password are not the same" }); return}

    //defining the user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        imageUrl: null,
        password: bcrypt.hashSync(req.body.password, 8), //encrypt the password using bcrypt library
    })

    //verifying duplicate username
    User.findOne({ username: req.body.username }).exec((err, user) => { if(user) { res.status(500).send({ message: "username already exist" }); return} else
        //verifying duplicate email
        User.findOne({ email: req.body.email }).exec((err, user) => { if(user){ res.status(500).send({ message: "email already exist" }); return} else
        
            //saving the user containing in newUser object
            newUser.save((err, user) => {
                if (err) {res.status(500).send({ message: "failed to register" }); return} //unknow error

                //generating the user token
                let token = jwt.sign({ id: user._id }, config.SECRET, { expiresIn: 86400 })
                console.log("\x1b[33m%s\x1b[0m", "JWT token as been generate")
                console.log("\x1b[33m%s\x1b[0m", token)

                //sending back the userId,email,token as a response
                res.status(200).send({ user: user, token: token })
                console.log("user add as been process")
            })
        }) 
    })
}

//GETROLE
exports.getrole = (req, res) => {
    console.log("\x1b[35m%s\x1b[0m", "::user.controller.getrole")

    User.findOne({ _id: req.params.id}).exec((err, user ) => {
        if (err) {res.status(500).send({ message: "error while signin you" }); return} //unknow error
        if (!user) {res.status(404).send({ message: "user does not exist" }); return}//user does not exist

        //sending back the userId,email,token as a response
        res.status(200).send(user)
        console.log("user search as been process")
    })
}

//SIGNIN
exports.signin = (req, res) => {
    console.log("\x1b[35m%s\x1b[0m", "::user.controller.signin")

    //verifying input
    if(!req.body.email) {res.status(500).send({ message: "email can not be empty" }); return}
    if(!req.body.password) {res.status(500).send({ message: "password can not be empty" }); return}

    //searching the user with the request email
    User.findOne({ email: req.body.email }).exec((err, user) => {
        if (err) {res.status(500).send({ message: "error while signin you" }); return} //unknow error
        if (!user) {res.status(404).send({ message: "user does not exist" }); return}//user does not exist

        //encrypting the request password and comparing the request and databse
        let passwordChecker = bcrypt.compareSync( req.body.password, user.password )
        if (!passwordChecker) {res.status(401).send({ message: "password is invalid" }); return} //password invalid

        //generating the user token
        let token = jwt.sign({ id: user._id }, config.SECRET, { expiresIn: 86400 })

        //sending back the userId,email,token as a response
        res.status(200).send({ user: user, token: token })
        console.log("user signin as been process")
    })
}

//DELETE ONE
exports.deleteone = (req, res) => {
    console.log("\x1b[35m%s\x1b[0m", "::user.controller.deleteone")
    //searching the user
    User.findOne({ _id: req.params.id }).exec((err, user) => { if(!user) { res.status(404).send({ message: "user does not exist" }); return} else

        //deleting the user
        User.deleteOne({ _id: req.params.id }).exec((err) => {
            if (err) {res.status(500).send({ message: "error while deleting the user" }); return} //unknow error

            //sending back a message as a response
            res.status(200).send({ message: "user as been delete" })
            console.log("user deletion as been process")
        })
    })
}

//GET ALL USERS
exports.getall = (req, res, next) => {
    console.log("\x1b[35m%s\x1b[0m", "::user.controller.getusers")
    //searching all user
    User.find({
    }).exec((err, users) => {
        if (err) {res.status(500).send({ message: "error while searching all users" }); return} //unknow error

        //sending users object as a response
        res.status(200).send(users)
        console.log("users search as been process")
    })
}

//GET ONE USER
exports.getone = (req, res, next) => {
    console.log("\x1b[35m%s\x1b[0m", "::user.controller.getone")
    //searching the user with the request id
    User.findOne({ _id: req.params.id }).exec((err, user) => {
        if (err) {res.status(500).send({ message: "error while searching the user" }); return} //unknow error
        if (!user) {res.status(404).send({ message: "user does not exist" }); return} //user not found

        //sending the user object as a response
        res.status(200).send(user)
        console.log("user search as been process")
    })
}

//UPDATE ONE USER
exports.updateone = (req, res, next) => {
    console.log("\x1b[35m%s\x1b[0m", "::user.controller.updateone")
    //verifying input
    let input = Object.values(req.body).every((item) => { return item !== ""; })
    if(!input) {res.status(500).send({ message: "one field is empty" }); return}

    //searching the user with the request id
    User.findOne({ _id: req.params.id }).exec((err, user) => {
        if(!user) {
            res.status(404).send({ message: "user does not exist" });
            return
        }
        //verifying if a file as been attach to the post
        let fileExist = function(){
            if(req.file){
                //deleting the previous image if it had one
                if(user.imageUrl != null){
                    const last_filename = user.imageUrl.split('/images/')[1];
                    fs.unlink('images/' + last_filename, () => {});
                }
                //definine the imageUrl
                return `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
            //deleting the image if the request was made
            else if(req.body.removeImage) {
                if(user.imageUrl != null){
                    const last_filename = user.imageUrl.split('/images/')[1];
                    fs.unlink('images/' + last_filename, () => {});
                }
                return null
            }
            else return req.body.imageUrl 
        }
        //updating the user with the request id
        User.updateOne({_id: req.params.id},{
            ... req.body, imageUrl: fileExist(),
            _id: req.params.id
        }).exec((err, user) => {
            if (err) {res.status(500).send({ message: "error while updating the user" }); return} //unknow error

            //sending the user object as a response
            res.status(200).send({ message: "user as been updated" })
            console.log("user update as been process")
        })
    })}