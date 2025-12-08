require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // FIXED ✔

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.clearCookie('token');
            return res.redirect('/auth/signin');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.clearCookie('token');
            return res.redirect('/auth/signin');
        }

        req.user = user;
        next();
    } catch (err) {
        res.clearCookie('token');
        res.redirect('/auth/signin');
        console.error('Token error:', err);
    }
};

module.exports = authenticateToken;