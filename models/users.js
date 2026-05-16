const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Add this at top

const userSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer'
    },
    profilePhoto: [
        {
            public_id:{
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    userId: {
        type: String,
        required: true,
        default: uuidv4,// Generate a unique ID by default 
        unique: true, // Ensure each user has a unique ID
    },
    username: {
        type: String,
        required: true,
        trim: true,
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
    address: [
        {
            street1:{
                type: String,
                trim: true,
            },
            street2:{
                type: String,
                trim: true,
            },
            city:{
                type: String,
                trim: true,
            },
            state:{
                type: String,
                trim: true,
            },
            pincode:{
                type: String,
                trim: true,
            },
            country:{
                type: String,
                trim: true,
            },
        }
    ],
    dob: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    occupation: {
        type: String,
        trim: true,
    },
    about: {
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