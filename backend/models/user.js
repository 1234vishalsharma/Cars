const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    userID : {
        type : String,
        required: true,
    },
    email :{
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required : true,
    }
})

module.exports = mongoose.model('User', UserSchema);