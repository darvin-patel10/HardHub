const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Define the schema for the product

    id: {
        type: String,
        required: true,
        unique: true // Ensure each product has a unique ID
    },
    image:[
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
    // image filename or path  
  
    name:{
        type: String,
        required: true,
        trim: true // trim whitespace
    }, 

    small_description:{
        type: String,
        required: true,
        trim: true // trim whitespace

    }, 

    price: {
        type: String,
        required: true,
        trim: true // trim whitespace
    },

    key_features: {
        type: [String],
        required: true,
        trim: true, // trim whitespace
        default: ["No key features available"] // default message if not provided
    },

    stock: {
        type: Number,
        required: true,
        trim: true, // trim whitespace
        default: 0 // default stock is 0
    }, 

    category:{
        type: String,
        trim: true, // trim whitespace
        required: true
    },

    Product_description: {
        type: String,
        required: true,
        trim: true // trim whitespace
    },

    Tech_Specifications:[
        {
            Brand:{
                type: String,
                required: true,
                trim: true // trim whitespace
            },
            Model_number:{
                type: Number,
                required: true,
                trim: true // trim whitespace
            },
            Model_type:{
                type: String,
                required: true,
                trim: true // trim whitespace
            },
            Material:{
                type: String,
                required: true,
                trim: true // trim whitespace
            },
            size:{
                type: Number,
                required: true,
                trim: true // trim whitespace
            },
            Weight:{
                type: Number,
                required: true,
                trim: true // trim whitespace
            },
        }, 
    ], 

    specs: Object // flexible for RAM, power, etc.
});

module.exports = mongoose.model('Product', productSchema);
// This model can be used to interact with the 'products' collection in MongoDB