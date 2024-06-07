const Book = require('../models/book.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const uploadOnCloudinary = require("../utils/cloudinary.js");
const { validationResult, matchedData } = require('express-validator');

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const addBook = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ApiError(422, "Data Validation errors", errors);

    if (!req.user._id) throw new ApiError(401, "Unauthorized access");
    const { title, author, course } = matchedData(req);
    const coverImageLocalPath = req?.files?.coverImage[0]?.path;
    const bookLocalPath = req?.files?.book[0]?.path;

    const coverImageSize = req?.files?.coverImage[0]?.size;
    const bookSize = req?.files?.book[0]?.size;

    if (!coverImageLocalPath || !bookLocalPath) throw new ApiError(400, "Book and cover image both are required");
    if (coverImageSize > MAX_FILE_SIZE || bookSize > MAX_FILE_SIZE) throw ApiError(400, "Maximum file size(10MB) exceeded");

    const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath, { resource_type: "auto" });
    const bookUrl = await uploadOnCloudinary(bookLocalPath, { resource_type: "auto" });

    if (!coverImageUrl || !bookUrl) throw new ApiError(500, "Error while uploading the book");

    const createdBook = await Book.create({
        title,
        author,
        uploadedBy: req.user._id,
        coverImage: coverImageUrl,
        bookUrl: bookUrl,
        course
    });
    if (!createdBook) throw new ApiError(500, "Error while creating the book");

    return res.status(201).json(new ApiResponse(201, createdBook, "Book Uploaded Successfully"));

});

module.exports = {
    addBook
}