const mongoose = require('mongoose');


const CarSchema = new mongoose.Schema({
    userID: { 
        type: String,
         required: true
    },
    carID : {
        type : String,
        required: true,
        unique: true,
        primary: true
    },
    images: {
        type: [String], 
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    model: {
        type: Number,
        required: true,
    },
    dealer : {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required : true,
    },
})

module.exports = mongoose.model('CarSchema', CarSchema);