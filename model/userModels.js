const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        min: 3,
        max: 20,
        required: true
    },
    email: {
        type: String,
        unique: true,
        min: 9,
        max: 50,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false
    },
    AvatarImage: {
        type: String,
        default: ""
    },
    verified: {
        type: Boolean,
        default: false, 
    },
})

module.exports = mongoose.model("Users", userSchema);