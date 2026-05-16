const express=require('express');
const app = express();
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const path=require('path');
const qs = require('qs'); // For parsing nested form data
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const db = require('./config/db'); // MongoDB connection
const port = process.env.PORT || 3000;

//Middulaware

const authenticateTokenOptional = require('./middleware/optionalAuth');


// Routes
const authentication = require('./routes/authenticationRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const userRoutes = require('./routes/userRoutes');


app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(cookieParser())

// Mount routes
app.use('/auth', authentication); // Use the authentication routes
app.use('/seller', sellerRoutes); // Use the seller routes
app.use('/buyer', userRoutes); // Use the user routes
// app.use('/cart', cartRoutes);
// app.use('/order', profileRoutes);

// app.get('*',async(req,res)=>{
//     res.render('index.ejs')
// })

app.get('/',authenticateTokenOptional, (req, res) => {
    try {
        // ✅ If user not logged in
        if (!req.user) {
            return res.render('customer/index.ejs');
        }

        // ✅ If Buyer
        if (req.user.type === 'buyer') {
            return res.redirect(`/buyer/product/${req.user._id}`);
        }

        // ✅ If Seller
        if (req.user.type === 'seller') {
            return res.redirect('/seller');
        }

        // fallback
        return res.render('customer/index.ejs');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// 🔥 Universal 404 handler
app.use((req, res) => {
    res.status(404).render('error/404.ejs', { message: 'Page Not Found' });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
