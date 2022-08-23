//importing mongoose library
const mongoose = require("mongoose")

//creating the user model base on the desire scheme
const Post = mongoose.model(
    "Post",
    new mongoose.Schema({
        userId: { type: String, required: true },
        content: { type: String, required: true },
        usersLiked: { type: [String], required: true },
        usersDisliked: { type: [String], required: true },
        imageUrl: { type: String, required: false},
        date: { type: Date, default: Date.now , required: true},
        user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}]
    })
)
module.exports = Post