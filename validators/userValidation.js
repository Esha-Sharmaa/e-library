const { body } = require('express-validator');

const validateUserData = [
    body('fullName')
        .notEmpty().withMessage("Name is required")
        .isString().withMessage("Name must be a string")
        .isLength({ min: 3 }).withMessage("Full Name must be 3 characters long")
        .matches(/^[A-Za-z\s]+$/).withMessage("Name must contain only alphabets and spaces"),
    
    body('email').not()
        .isEmail().withMessage('Invalid Email address'),
    
    body('password').notEmpty().withMessage("Password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('phoneNumber')
        .isLength({ min: 10, max: 10 }).withMessage("Phone Number should be of length 10")
        .isNumeric().withMessage("Phone number should only contains numbers"),
    
    body('enrollmentNumber')
        .notEmpty().withMessage("Enrollment Number is required")
        .isAlphanumeric().withMessage("Enrollment Number must contain only letters and numbers")
];
module.exports = validateUserData;