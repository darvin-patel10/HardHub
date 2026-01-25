const isSeller = (req, res, next) => {
    try {
        if (!req.user) {
            return res.redirect('/auth/signin');
        }

        if (req.user.type !== 'seller') {
            return res.status(403).send('❌ Access denied: Sellers only');
            // OR redirect:
            // return res.redirect('/buyer/dashboard');
        }

        next();
    } catch (err) {
        console.error('Seller check error:', err);
        res.status(500).send('Server error');
    }
};

module.exports = isSeller;
