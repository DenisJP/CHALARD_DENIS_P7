//importing mongoose library
const mongoose = require("mongoose")

//creating the user model base on the desire scheme
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: {type: String, required: true, unique: true},
        email: {type: String, required: true, unique: true},
        imageUrl: { type: String, required: false},
        password: {type: String, required: true},
        role: {type: Number, enum:[0, 1, 2], default: 0, required: true},
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post"}]
    })
)
module.exports = User