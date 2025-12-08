const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true
    },
    items: [{
        productId: {
            type: String,
            required: true
        },
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
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', cartSchema);