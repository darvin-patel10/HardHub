const mongoose = require('mongoose');

    const dbUrl = process.env.MONGO_URL;
    main()
        .then(() =>{
            console.log("✅ MongoDB connected successfully");
        })
        .catch((err)=>{
            console.log("❌ MongoDB connection error:",err);
        });
    
    async function main() {
        await mongoose.connect(dbUrl);
    }

module.exports = mongoose.connection;    