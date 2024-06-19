const { query } = require('express-validator');
const validateDeleteUser = [
    query('id')
        .notEmpty().withMessage('User ID is required')
        .isMongoId().withMessage('Invalid User ID format'),
];
module.exports = validateDeleteUser;