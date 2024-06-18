const { body } = require('express-validator');
const validateBlog = [
    body('blogTitle')
        .trim()
        .notEmpty().withMessage('Title cannot be empty.')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters.'),

    body('blogContent')
        .trim()
        .notEmpty().withMessage('Content cannot be empty.')
        .isLength({ max: 10000 }).withMessage('Content cannot exceed 5000 characters.')
];
module.exports = validateBlog;