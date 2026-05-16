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

// const mongoose = require('mongoose');

// const connectDB = async () => {
//     const dbUrl = "mongodb+srv://darvinstd9749_db_user:eAwTwOV9UeujCaix@hardhub.vznnpqx.mongodb.net/hardhub";
//     await mongoose.connect(dbUrl);
//     console.log("MongoDB connected successfully");
// };

// module.exports = connectDB;
