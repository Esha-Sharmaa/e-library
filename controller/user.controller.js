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
        console.error(errors);
        throw new ApiError(422, "Validation Errors", errors);
    }

    const { enrollmentNumber, fullName, password, email, phoneNumber, role } = matchedData(req);
    const existedUser = await User.findOne({ $or: { enrollmentNumber, email, phoneNumber } });

    if (existedUser) throw new ApiError(409, "Enroll, email or phoneNumber already existed");

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
    if (!createdUser) throw new ApiError(500, "Internal Server Error while registering User");
    return res.status(201).json(new ApiResponse(201, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { enrollmentNumber, password } = req.body;
    console.log(enrollmentNumber, password);
    if (!enrollmentNumber) throw new ApiError(400, "Enrollment Number is required");
    if (!password) throw new ApiError(400, "Password is required");

    const foundUser = await User.findOne({ enrollmentNumber });
    if (!foundUser) throw new ApiError(404, "User not found");

    const isPasswordMatched = foundUser.isPasswordCorrect(password);
    if (!isPasswordMatched) throw new ApiError(401, "Bad Credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(foundUser._id);
    const loggedInUser = await User.findById(foundUser._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, loggedInUser, "User Logged In successfully"));
});
const changeUserPassword = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    if (!newPassword) throw new ApiError(400, "New Password is Required");
    if (!oldPassword) throw new ApiError(400, "Old Password is required");

    const foundUser = await User.findById(req?.user?._id);
    if (!foundUser) throw new ApiError(404, "User not found");

    const isPasswordMatched = foundUser.isPasswordCorrect(oldPassword);
    if (!isPasswordMatched) throw new ApiError(400, "Bad Request, Incorrect Password");
    const updatedUser = await User.findByIdAndUpdate(req?.user?._id, {
        $set: {
            password: newPassword
        }
    }, {
        new: true
    }).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, updatedUser, "Password Changed Successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingToken = req?.cookies?.refreshToken || req?.body?.refreshToken;
    if (!incomingToken) throw new ApiError(401, "Unauthorized Access");

    const decodedTokenInfo = verify(incomingToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    if (!decodedTokenInfo) throw new ApiError(401, "Invalid Refresh Token");

    const user = await User.findById(decodedTokenInfo?._id);
    if (!user) throw new ApiError(401, "Invalid Refresh Token");

    if (incomingToken !== user.refreshToken) throw new ApiError(401, "Refresh Token is expired or used");
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(decodedTokenInfo?._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { accessToken, refreshToken }, "Access Token re-generated successfully"));

});
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req?.file?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar image is required");

    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    if (!avatarUrl) throw new ApiError(500, "Error while uploading image");
    const user = await User.findByIdAndUpdate(req?.user?._id, {
        $set: {
            avatar: avatarUrl
        }
    }, {
        new: true
    }).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, user, "Avatar update Successfully"));

});
const updateUserDetails = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ApiError(422, "Validation Errors");

    const { fullName, email, phoneNumber } = matchedData(req);

    // Dynamically build the update object
    let updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;


    const updatedUser = await User.findByIdAndUpdate(req?.user?._id, {
        $set: updateFields
    }).select("-password -refreshToken");
    if (!updatedUser) throw new ApiError(500, "Error while updating the user");
    return res.status(200).json(new ApiResponse(200, updatedUser, "User Details updated successfully"));

});
const getUserInfo = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User data fetched successfully"));
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