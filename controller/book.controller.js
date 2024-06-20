const Book = require('../models/book.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { validationResult, matchedData } = require('express-validator');

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const addBook = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        req.flash('error', 'Validation errors');
        return res.status(402).redirect('/book-list');
    }

    if (!req.user._id) {
        console.log(errors);
        req.flash('error', 'Unauthorized Access');
        return res.status(403).redirect('/403');
    }
    const { title, author, course } = matchedData(req);
    const coverImageLocalPath = req?.files?.coverImage[0]?.path;
    const bookLocalPath = req?.files?.book[0]?.path;

    const coverImageSize = req?.files?.coverImage[0]?.size;
    const bookSize = req?.files?.book[0]?.size;

    if (!coverImageLocalPath || !bookLocalPath) {
        console.log(errors);
        req.flash('error', 'Cover Image and Book File both are required');
        return res.status(400).redirect('/book-list');
    }
    if (coverImageSize > MAX_FILE_SIZE || bookSize > MAX_FILE_SIZE) {
        console.log(errors);
        req.flash('error', 'Maximum file size(10MB) exceeded');
        return res.status(400).redirect('/book-list');
    }

    const coverImageUrl = await uploadOnCloudinary(coverImageLocalPath, { resource_type: "auto" });
    const bookUrl = await uploadOnCloudinary(bookLocalPath, { resource_type: "auto" });

    if (!coverImageUrl || !bookUrl) {
        return res.status(500).redirect('/500');
    }
    const createdBook = await Book.create({
        title,
        author,
        uploadedBy: req.user._id,
        coverImage: coverImageUrl,
        bookUrl: bookUrl,
        course
    });
    if (!createdBook) {
        return res.status(500).redirect('/500');
    }
    req.flash('success', "Book Updated successfully");
    return res.status(201).redirect('/book-list');

});
const deleteBook = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Invalid Book Id');
        return res.status(400).redirect('/book-list');
    }
    const bookId = req.query.id;
    const book = await Book.findById(bookId);

    if (!book) {
        req.flash('error', 'Book not found');
        return res.status(404).redirect('/book-list');
    }

    try {
        // Delete the resources from Cloudinary
        if (book.coverImage) {
            await deleteFromCloudinary(book.coverImage);
        }

        if (book.bookUrl) {
            await deleteFromCloudinary(book.bookUrl);
        }

        // Delete the book from the database
        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            req.flash('error', 'Error while deleting the book');
            return res.status(500).redirect('/book-list');
        }

        req.flash('success', 'Book deleted successfully');
        return res.status(200).redirect('/book-list');
    } catch (error) {
        console.error('Error deleting book:', error);
        req.flash('error', 'An error occurred while deleting the book');
        return res.status(500).redirect('/book-list');
    }
});

module.exports = {
    addBook,
    deleteBook
};