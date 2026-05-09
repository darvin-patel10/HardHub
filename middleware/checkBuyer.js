const isBuyer = (req, res, next) => {
    try {
        if (!req.user) {
            return res.redirect('/auth/signin');
        }

        if (req.user.type !== 'buyer' ) {
            return res.status(403).render('error/accessDenied.ejs');
            // OR redirect:
            // return res.redirect('/buyer/dashboard');
        }

        next();
    } catch (err) {
        console.error('Buyer check error:', err);
        res.status(500).send('Server error');
    }
};

module.exports = isBuyer;
