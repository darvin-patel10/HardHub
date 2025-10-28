const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true, // Ensure each user has a unique ID
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true, // Ensure phone number is unique
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    specs: Object
});

module.exports = mongoose.model('User', userSchema);