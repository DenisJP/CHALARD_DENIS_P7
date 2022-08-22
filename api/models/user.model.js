//importing mongoose library
const mongoose = require("mongoose")

//creating the user model base on the desire scheme
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        imageUrl: { type: String, required: false},
        password: {type: String, required: true}
    })
)
module.exports = User