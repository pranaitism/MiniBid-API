const mongoose = require('mongoose')
const {Schema} = require("mongoose");


const ItemSchema = mongoose.Schema({
    title: {
        type: String,
        min: 3,
        max: 40,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    condition: {
        type: String,
        required: true,
        min: 3,
        max: 11,
        enum: ["New", "Old", "Refurbished"]
    },
    description: {
        type: String,
        min: 10,
        max: 500
    },
    owner: {type: Schema.Types.ObjectId, ref: 'User'}

})


module.exports = mongoose.model('items', ItemSchema)
