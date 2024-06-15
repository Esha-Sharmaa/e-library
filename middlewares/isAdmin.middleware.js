const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    }
    else {
        return res.render('user/403', { req });
    }
}

module.exports = isAdmin;