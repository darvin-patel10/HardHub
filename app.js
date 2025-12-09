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
const port = process.env.PORT;

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
app.use('/', userRoutes); // Use the user routes

app.listen(port,()=>{
    console.log('Server is running on port 3000');
});