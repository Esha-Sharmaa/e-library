const { body } = require('express-validator');

const validateUploadBookDetails = [
    body('title')
        .trim()
        .notEmpty().withMessage('Book Title is required')
        .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Title must contain only letters, digits, and spaces'),
    body('author')
        .trim()
        .notEmpty().withMessage('Book Author is required')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Author name must contain only letters and spaces'),
    body('course')
        .trim()
        .notEmpty().withMessage('Related Course is required')
        .isIn(["MCA", "BCA", "MBA(E.Com)", "All", "General"]).withMessage('Invalid course name')
];
module.exports = validateUploadBookDetails;