const jwt = require('jsonwebtoken');
const User = require('../models/users');

const authenticateTokenOptional = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return next(); // ✅ allow guest
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId).select('-password');

        if (user) {
            req.user = user;
        }

        next();
    } catch (err) {
        console.error('Optional auth error:', err);
        next(); // still allow
    }
};

module.exports = authenticateTokenOptional;