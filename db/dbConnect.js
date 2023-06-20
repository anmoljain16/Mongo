const mongoose = require('mongoose')
const dotenv = require("nodemon");
require('dotenv').config();
// dotenv.config({ path: "config.env" });

async function dbConnect (){

    mongoose.connect(process.env.DB_URL )
        .then( () => console.log( "DB Connected"))
        .catch( error => console.log( 'Error ' , error ))
}

module.exports= dbConnect



