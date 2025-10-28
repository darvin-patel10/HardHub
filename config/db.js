const mongoose = require('mongoose');


    main()
        .then(() =>{
            console.log("✅ MongoDB connected successfully");
        })
        .catch((err)=>{
            console.log("❌ MongoDB connection error:",err);
        });
    
    async function main() {
        await mongoose.connect('mongodb://127.0.0.1:27017/joy');
    }

module.exports = mongoose.connection;    