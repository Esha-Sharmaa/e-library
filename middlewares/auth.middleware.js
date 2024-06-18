const { verify } = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncHandler = require('../utils/asyncHandler.js');
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const accessToken = req?.cookies?.accessToken;
        if (!accessToken) return res.redirect("user/login");

        const decodedTokenInfo = verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);

        const user = await User.findById(decodedTokenInfo?._id).select("-password -refreshToken");

        if (!user) return res.redirect('user/login');
        req.user = user;

        next();
    } catch (error) {
        console.log("Error Verifying AccessToken", error);
        return res.redirect('user/login');
    }

});
module.exports = verifyJWT;