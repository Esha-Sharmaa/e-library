const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    enrollmentNumber: {
        type: String,
        required: [true, "Enroll Number is required"],
        unique: [true, "Enroll Number already exists"],
        index: true
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        lowercase: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        unique: [true, "Phone Number already exists"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: ["Student", "Admin"],
        required: [true, "Role is required"]
    },
    course: {
        type: String,
        enum: ["BCA", "MCA", "MBA(E.com)","Faculty"],
        default: "BCA"
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Male"
    },
    DOB: {
        type: Date,
        default: new Date('2000-01-01')
    },
    refreshToken: {
        type: String
    },
    avatar: {
        type: String,
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            enrollmentNumber: this.enrollmentNumber,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}
module.exports = mongoose.model('User', userSchema);