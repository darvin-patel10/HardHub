const mongoose = require('mongoose');

const buySchema = new mongoose.Schema({
    // Define the schema for the product
    orderid: {
        type: String,
        required: true,
        unique: true
    },
    productId: {
        type: String,
        required: true,
        unique: true
    },

    firstname:{
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pincode: {
        type: Number,
    },
    country: {
        type: String,
        default: "India"
    },
    items: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        image: {
            type: String, // You can store the image URL here
            required: true
        },
        
        total: {
            type: Number,
            required: true,
            default: 0
        }
    }],
    totalUniqueItems: {
        type: Number,
        default: 0
    },

    subtotal: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        default: 'Processing' // Default status can be 'Processing', 'Shipped', 'Delivered', etc.
    },    
    createdAt: {
        type: Date,
        default: Date.now
    },
    specs: Object // flexible for RAM, power, etc.
});

module.exports = mongoose.model('Buy', buySchema);
// This model can be used to interact with the 'products' collection in MongoDB