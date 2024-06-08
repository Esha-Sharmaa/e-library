const ApiError = require("../utils/ApiError");


const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') next();
    else throw new ApiError(403, "Only Admins can add a book");
}

module.exports = isAdmin;