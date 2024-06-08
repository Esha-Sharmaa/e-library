const { body } = require('express-validator');

const validateUpdateUser = [
    body('fullName')
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Name must be a string")
        .isLength({ min: 3 }).withMessage("Full Name must be 3 characters long")
        .matches(/^[A-Za-z\s]+$/).withMessage("Name must contain only alphabets and spaces"),

    body('email')
        .optional({ checkFalsy: true })  // Marks the field as optional, and treats empty strings as absent
        .isEmail().withMessage('Invalid Email address'),

    body('phoneNumber')
        .optional({ checkFalsy: true })  // Marks the field as optional, and treats empty strings as absent
        .isLength({ min: 10, max: 10 }).withMessage("Phone Number should be of length 10")
        .isNumeric().withMessage("Phone number should only contain numbers"),

    body('course')
        .optional({ checkFalsy: true })
        .isIn(["BCA", "MCA", "MBA(E.com)", "Faculty"]).withMessage("Invalid course"),

    body('gender')
        .optional({ checkFalsy: true })
        .isIn(["Male", "Female", "Other"]).withMessage("Invalid gender"),

    body('DOB')
        .optional({ checkFalsy: true })  // Marks the field as optional, and treats empty strings as absent
        .isString().withMessage("Date of Birth must be a string"),
];

module.exports = validateUpdateUser;
