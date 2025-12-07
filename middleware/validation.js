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

// const jwt = require('jsonwebtoken');
// const User = require('../models/users'); // Assuming you have a User model
// const authentication = require('../routes/authenticationRoutes');
// // const sellerRoutes = require('./routes/sellerRoutes');
// // const userRoutes = require('./routes/userRoutes');


// const authenticateToken = async (req, res, next) => {
//     try {
//         // Get token from different sources
//         const token = getTokenFromRequest(req);
        
//         if (!token) {
//             res.status(401).send('Access denied. No token provided.');
//             res.clearCookie('token');
//             return res.redirect('/auth/signin');
//         }
//             // return res.status(401).json({
//             //     success: false,
//             //     message: 'Access denied. No token provided.'
//             // });
        

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET );
        
//         // Find user in database
//         const user = await User.findById(decoded.userId).select('-password');

//         if (!user) {
//             res.status(401).send('Invalid token. User not found.');
//             res.clearCookie('token');
//             return res.redirect('/auth/signin');
//         }

//         // Attach user to request object
//         req.user = user;
//         next();
//     }

//     catch (err) {
//         console.error('Token verification error:', err);
//         return res.redirect('/auth/signin');
//         // return res.status(400).json({
//         //     success: false,
//         //     message: 'Invalid token.'
//         // });
//     }
// }

// module.exports = authenticateToken;