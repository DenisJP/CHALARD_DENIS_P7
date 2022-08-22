//importing express
const express = require('express')

//importing require library
const cors = require('cors') //for cross-origin
const path = require('path'); //for path accesibility

//importing .env file
require('dotenv').config()

//initialising the express app
console.clear()
console.log("\x1b[34m%s\x1b[0m","CHALARD DENIS - API - PROJECT P7")
console.log("\x1b[33m%s\x1b[0m","==> initialise express app")
const app = express()
//configuring the express app
console.log("configuring express")
app.use(cors());
app.use(express.urlencoded({extended: true}, {limit: '50mb'})); 
app.use(express.json({limit: '50mb'}));
app.use('/images', express.static(path.join(__dirname, 'images'))); //path request on URL /images will go in folder images

//import routes
console.log("adding user routes")
require('./routes/user.routes')(app) //user routes
console.log("adding post routes")
require('./routes/post.routes')(app) //post routes

//configuring the database
console.log("configuring database")
const db = require("./models")
const dbConfig = require("./config/db.config")
db.mongoose
  .connect(`${dbConfig.STRING_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((response) => { console.log("\x1b[32m%s\x1b[0m",'[O] DATABASE is connect')})
  .catch((error) => {console.log("\x1b[41m%s\x1b[0m",'error while connecting to the database')})

//listen request on the define port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("\x1b[32m%s\x1b[0m",'[O] API is now running on port:' + PORT)
})