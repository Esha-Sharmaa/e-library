const User = require('../models/user.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const { validationResult, matchedData } = require('express-validator');
const uploadOnCloudinary = require('../utils/cloudinary.js');
const { verify } = require('jsonwebtoken');


const options = {
    httpOnly: true,
    secure: true
}
const generateAccessAndRefreshToken = async (id) => {
    try {
        const foundUser = await User.findOne({ _id: id });
        const accessToken = foundUser.generateAccessToken();
        const refreshToken = foundUser.generateRefreshToken();
        foundUser.refreshToken = refreshToken;
        await foundUser.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.log("Error while generating tokens", error);
        throw new ApiError(500, "Internal Server Error");
        return null;
    }
}
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Validation Errors');
        return res.status(422).redirect('/register');
    }

    const { enrollmentNumber, fullName, password, email, phoneNumber, role } = matchedData(req);
    const existedUser = await User.findOne({ $or: { enrollmentNumber, email, phoneNumber } });

    if (existedUser) {
        req.flash('error', 'User already exists');
        return res.status(402).redirect('/register');
    }

    const avatarLocalPath = req?.file?.path;
    console.log(avatarLocalPath);
    let avatarUrl;
    if (avatarLocalPath) avatarUrl = await uploadOnCloudinary(avatarLocalPath);

    const user = await User.create({
        enrollmentNumber,
        fullName,
        email: email || null,
        phoneNumber: phoneNumber || null,
        avatar: avatarUrl || "",
        password,
        role
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        req.flash('error', 'Error creating user. Try Again');
        return res.status(500).redirect('/register');
    }
    req.flash('success', 'User registered in successfully');
    res.status(201).redirect('/dashboard');
});

const loginUser = asyncHandler(async (req, res) => {
    const { enrollmentNumber, password } = req.body;

    if (!enrollmentNumber) {
        req.flash('error', 'Enrollment Number is required');
        return res.status(400).redirect('/login');
    }

    if (!password) {
        req.flash('error', 'Password is required');
        return res.status(400).redirect('/login');
    }

    const foundUser = await User.findOne({ enrollmentNumber });
    if (!foundUser) {
        req.flash('error', 'User not found');
        return res.status(404).redirect('/login');
    }

    const isPasswordMatched = await foundUser.isPasswordCorrect(password);
    if (!isPasswordMatched) {
        req.flash('error', 'Invalid Credentials');
        return res.status(400).redirect('/login');
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(foundUser._id);
    const loggedInUser = await User.findById(foundUser._id).select("-password -refreshToken");
    res.cookie('accessToken', accessToken, options);
    res.cookie('refreshToken', refreshToken, options);

    req.flash('success', 'User logged in successfully');
    res.status(200).redirect('/dashboard');
});
const changeUserPassword = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    if (!newPassword || !oldPassword) {
        req.flash('error', 'Passwords are required');
        return res.status(400).redirect('/changePassword');
    }

    const foundUser = await User.findById(req?.user?._id);
    if (!foundUser) {
        req.flash('error', 'User not found');
        return res.status(404).redirect('/login');
    }

    const isPasswordMatched = foundUser.isPasswordCorrect(oldPassword);
    if (!isPasswordMatched) {
        req.flash('error', 'Invalid Credentials');
        return res.status(400).redirect('/login');
    }
    const updatedUser = await User.findByIdAndUpdate(req?.user?._id, {
        $set: {
            password: newPassword
        }
    }, {
        new: true
    }).select("-password -refreshToken");

    req.flash('success', 'Password Changed successfully');
    res.status(200).redirect('/dashboard');
});
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req?.cookies?.refreshToken || req?.body?.refreshToken;
    if (!incomingToken) {
        req.flash('error', 'Unauthorized access');
        return res.status(403).redirect('/login');
    }

    const decodedTokenInfo = verify(incomingToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    if (!decodedTokenInfo) {
        req.flash('error', 'Invalid Refresh Token');
        return res.status(401).redirect('/login');
    }

    const user = await User.findById(decodedTokenInfo?._id);
    if (!user) {
        req.flash('error', 'Invalid Refresh Token');
        return res.status(401).redirect('/login');
    }

    if (incomingToken !== user.refreshToken) throw new ApiError(401, "Refresh Token is expired or used");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(decodedTokenInfo?._id);

    res.cookie('accessToken', accessToken, options);
    res.cookie('refreshToken', refreshToken, options);

    req.flash('success', 'Access Token generated successfully');
    res.status(200).redirect('/dashboard');
});
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req?.file?.path;
    if (!avatarLocalPath) {
        req.flash('error', 'Avatar image is required');
        return res.status(400).redirect('/login');
    }

    const avatarUrl = await uploadOnCloudinary(avatarLocalPath, { resource_type: "auto" });
    if (!avatarUrl) {
        req.flash('error', 'Error while uploading. Try Again later');
        return res.status(500).redirect('/login');
    }
    const user = await User.findByIdAndUpdate(req?.user?._id, {
        $set: {
            avatar: avatarUrl
        }
    }, {
        new: true
    }).select("-password -refreshToken");

    req.flash('success', 'Avatar updated successfully');
    res.status(200).redirect('/dashboard');

});
const updateUserDetails = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Validation errors');
        return res.status(400).redirect('/login');
    }

    const { fullName, email, phoneNumber, course, gender, DOB } = matchedData(req);

    // Dynamically build the update object
    let updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (course) updateFields.course = course;
    if (gender) updateFields.gender = gender;
    if (DOB) updateFields.DOB = DOB;


    const updatedUser = await User.findByIdAndUpdate(req?.user?._id, {
        $set: updateFields
    }).select("-password -refreshToken");
    if (!updatedUser) {
        req.flash('error', 'Error while updating the user');
        return res.status(500).redirect('/login');
    }

    req.flash('success', 'User data updated successfully');
    res.status(200).redirect('/dashboard');

});
const getUserInfo = asyncHandler(async (req, res) => {
    return res.render('userProfile', req.user);
});

module.exports = {
    registerUser,
    loginUser,
    updateUserAvatar,
    changeUserPassword,
    refreshAccessToken,
    getUserInfo,
    updateUserDetails
}