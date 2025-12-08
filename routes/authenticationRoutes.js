const express = require('express');
const router = express.Router(); // ✅ Use router instead of app
// const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

// ------------------------------- User Registration ---------------------------

const key = process.env.SECRET_KEY;

router.post('/registor', async (req, res) => {
    const { username, email, phone, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400).send('User already exists with this email');
        return res.redirect('/auth/signup');
    }

    try {
        bcrypt.genSalt(10, (err, salt)=> {
            console.log("✅ Salt generated successfully", salt);

            bcrypt.hash(password, salt, async (err, hash)=> {
                // Store hash in your password DB.
                console.log("✅ Password hashed successfully", hash);
                const user = new User({
                    username,
                    // userId,
                    email,
                    phone,
                    password: hash, // Store the hashed password
                });
                
                    await user.save();
                    console.log("✅ User saved successfully", user);

                    // Generate JWT token
                    let token = jwt.sign({ email:email, userId: user._id}, key);
                    console.log("✅ JWT token generated successfully");

                    res.cookie('token', token);
                    console.log("✅ Cookie set with token");

                    res.redirect('/auth/signin');
                
                
            });
        });

    } catch (err) {
        console.error("❌ Error during user registration:", err);
        res.redirect('/auth/signup');
        res.status(500).send('Error registering user');
    }
});


// ------------------------------- User Login ---------------------------

router.post('/login', async (req, res) => {
    console.log("✅ Login request received");
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
        return res.send('User not found with this email');
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if(result) {
            // Passwords match
            let token = jwt.sign({ email: user.email, userId: user._id }, key);
            console.log("✅ JWT token generated successfully");

            res.cookie('token', token);
            console.log("✅ Cookie set with token");

            res.redirect(`/product/${user._id}`);
        } else {
            // Passwords do not match
            return res.send('Incorrect password');
        }
    });
});

// ------------------------------- User Logout ---------------------------

router.post('/logout', (req, res) => {
    console.log("✅ Logout request received");
    // Clear the cookie
    res.clearCookie('token');
    console.log("✅ Cookie cleared");

    // Redirect to the login page
    res.redirect('/auth/signin');
});

// ------------------------------- Render Forms ---------------------------

router.get('/signup', (req, res) => {
    res.render('Authentication/sign-up.ejs');
});

router.get('/signin', (req, res) => {
    res.render('Authentication/sign-in.ejs');
});

module.exports = router; // ✅ Export the router
