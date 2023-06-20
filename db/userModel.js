const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please provide your name']
    },
    phone:{
        type: Number,
        required: [true,'Please provide phonoe number'],
        unique:[true,'phone number already in use']
    },
    email: {
        type: String,
        required: [true,'PLease Provide Email'],
        unique: [true,'Email already in use']
    },
    password: {
        type: String,
        required: [true,'PLease Provide Password'],
    }

})


module.exports = mongoose.model.Users || mongoose.model('Users',UserSchema)

