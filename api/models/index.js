//importing database library mongoose
const mongoose = require('mongoose')
mongoose.Promise = global.Promise //Promise are for async response

//initialising the database
const db = {}
//configuring the database
db.mongoose = mongoose

//adding models into our database object
console.log('adding user schema')
db.user = require("./user.model.js") //user database schema
console.log('adding post schema')
db.post = require("./post.model.js") //post database schema

module.exports = db