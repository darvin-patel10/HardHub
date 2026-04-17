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
            type: String, 
            required: true
        },
        Model_number:{
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true
        },
        Material: {
            type: String,
            required: true
        },
        size: {
            type: String,
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
        required: true,
        default: 0
    },

    tax: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', cartSchema);