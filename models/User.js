const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 256
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 256,
        unique: true
    },
    password: {
        type: String,
        min: 3,
        max: 1024,
        required: true
    },
    city: {
        type: String,
        min: 3,
        max: 85
    }
});

module.exports = mongoose.model("users", userSchema)