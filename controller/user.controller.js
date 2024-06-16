const User = require('../models/user.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
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
        
    }
}
const renderAdminDashboard = (req, res) => {
    res.render('admin/dashboard');
}
const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Invalid input data');
        return res.status(422).redirect('/admin-list');
    }

    const { enrollmentNumber, fullName, password, email, phoneNumber, role } = matchedData(req);
    const existedUser = await User.findOne({ $or: { enrollmentNumber, email, phoneNumber } });

    if (existedUser) {
        req.flash('error', 'User already exists');
        return res.status(402).redirect('/admin-list');
    }

    const avatarLocalPath = req?.file?.path;
    console.log(avatarLocalPath);
    let avatarUrl;
    if (avatarLocalPath) avatarUrl = await uploadOnCloudinary(avatarLocalPath);

    const user = await User.create({
        enrollmentNumber,
        fullName,
        password,
        role,
        email: email || null,
        phoneNumber: phoneNumber || null,
        avatar: avatarUrl | " "
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser) {
        req.flash('error', 'Error creating user. Try Again');
        return res.status(500).redirect('/admin-list');
    }
    req.flash('success', 'User registered in successfully');
    if (createdUser.role === 'Admin')
        return res.status(201).redirect('/admin-list');
    else
        return res.status(201).redirect('/student-list');
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
    if (loggedInUser.role === 'Admin') return res.status(200).redirect('/admin-dashboard');
    return res.status(200).redirect("/");

});
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    req.flash('success', 'User logged out successfully');
    res.status(200).redirect('/login');
});
const changeUserPassword = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    console.log(newPassword, oldPassword);
    if (!newPassword || !oldPassword) {
        req.flash('error', 'Passwords are required');
        return res.status(400).redirect('/admin-profile');
    }

    const foundUser = await User.findById(req?.user?._id);
    if (!foundUser) {
        req.flash('error', 'User not found');
        return res.status(404).redirect('/admin-profile');
    }

    const isPasswordMatched = await foundUser.isPasswordCorrect(oldPassword);
    if (!isPasswordMatched) {
        req.flash('error', 'Invalid Credentials');
        return res.status(400).redirect('/admin-profile');
    }
    const updatedUser = await User.findById(req?.user?._id).select("-password -refreshToken");
    updatedUser.password = newPassword;
    await updatedUser.save();
    req.flash('success', 'Password Changed successfully');
    res.status(200).redirect('/admin-profile');
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
        return res.status(400).redirect('/admin-profile');
    }

    const avatarUrl = await uploadOnCloudinary(avatarLocalPath, { resource_type: "auto" });
    if (!avatarUrl) {
        req.flash('error', 'Error while uploading. Try Again later');
        return res.status(500).redirect('/admin-profile');
    }
    const user = await User.findByIdAndUpdate(req?.user?._id, {
        $set: {
            avatar: avatarUrl
        }
    }, {
        new: true
    }).select("-password -refreshToken");

    req.flash('success', 'Avatar updated successfully');
    res.status(200).redirect('/admin-profile');

});
const updateUserDetails = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        req.flash('error', 'Validation errors');
        return res.status(400).redirect('/admin-profile');
    }

    const { fullName, email, phoneNumber, course, gender, DOB } = matchedData(req);
    const existedUser = await User.findOne({ $or: { email, phoneNumber } });
    if (existedUser &&  existedUser._id !== req.user._id) {
        req.flash('error', 'User already exists');
        if (req.user.role === 'Admin')
            return res.status(402).redirect('/admin-profile');
        else
            return res.status(402).redirect('/user-profile');
    }
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
        if (req.user.role === 'Admin')
            return res.status(500).redirect('/admin-profile');
        else
            return res.status(500).redirect('/user-profile');
    }
    req.flash('success', 'User data updated successfully');
    if (req.user.role === 'Admin')
        return res.status(200).redirect('/admin-profile');
    else
        return res.status(200).redirect('/user-profile');

});
const getUserInfo = asyncHandler(async (req, res) => {
    return res.render('userProfile', req.user);
});
const deleteUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Invalid User Id');
        return res.status(400).redirect('/admin-list');
    }

    const { id } = req.query;

    const user = await User.findOneAndDelete({ _id: id });;
    if (!user) {
        req.flash('error', 'User not found');
        return res.status(404).redirect('/admin-list');
    }
    req.flash('success', 'User deleted successfully');
    return res.status(400).redirect('/admin-list');
})
module.exports = {
    registerUser,
    loginUser,
    updateUserAvatar,
    changeUserPassword,
    refreshAccessToken,
    getUserInfo,
    updateUserDetails,
    renderAdminDashboard,
    logoutUser, deleteUser
}