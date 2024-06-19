const User = require('../models/user.model.js');
const Blog = require("../models/blog.model.js");
const Book = require("../models/book.model.js");
const { validationResult, matchedData } = require('express-validator');

const asyncHandler = require('../utils/asyncHandler.js');


const handleUserHomePage = (req, res) => {
    res.render('user/index', { req });
}
const handleUserProfilePage = (req, res) => {
    res.render('user/profile', { req, loggedUser: req.user })
}
const handleBlogPage = asyncHandler(async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const pageSize = 6;
        const skip = (currentPage - 1) * pageSize;
        // Get the total count of blogs
        const totalBlogs = await Blog.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalBlogs / pageSize);

        const blogList = await Blog.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "writer",
                    foreignField: "_id",
                    as: "writerInfo"
                }
            },
            {
                $unwind: "$writerInfo"
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    "writerInfo.fullName": 1,
                    "writerInfo.avatar": 1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            }
        ]);
        req.flash('success', "Blogs fetched successfully");
        return res.render('user/blog', { req, loggedUser: req.user, blogList, currentPage, totalPages });


    } catch (error) {
        console.log("Error fetching blogs", error);
        req.flash('error', 'Error fetching blogs');
        return res.status(500).redirect('/');
    }
})
const handleBooksPage = asyncHandler(async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const pageSize = 6;
        const skip = (currentPage - 1) * pageSize;
        // Get the total count of books
        const totalBooks = await Book.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalBooks / pageSize);
        const bookList = await Book.aggregate([
            {
                $project: {
                    title: 1,
                    author: 1,
                    coverImage: 1,
                    bookUrl: 1,
                    course: 1
                }
            }, {
                $skip: skip
            }, {
                $limit: pageSize
            }
        ]);
        if (!bookList) return res.render('user/500', { req });
        return res.render('user/books', { req, loggedUser: req.user, bookList, currentPage, totalPages });

    } catch (error) {
        console.log("Error fetching books list", error.message);
        return res.render('user/500', { req });
    }
})
const handleLoginRender = (req, res) => {
    res.render('user/login');
}
const handleAdminDashboardRender = asyncHandler(async (req, res) => {
    const userList = await User.find();
    const blogs = await Blog.countDocuments();
    const bookList = await Book.find();
    res.render('admin/dashboard', { loggedUser: req.user, userList, blogs, bookList });
})
const handleAdminProfileRender = (req, res) => {
    res.render("admin/profile", { loggedUser: req.user });
}
const handleAdminListRender = asyncHandler(async (req, res) => {
    const userList = await User.find();
    const adminList = userList.filter(user => user.role === 'Admin');
    res.render("admin/adminList", { loggedUser: req.user, adminList });
});
const handleStudentListRender = asyncHandler(async (req, res) => {
    const userList = await User.find();
    const studentList = userList.filter(user => user.role === 'Student');
    res.render("admin/studentList", { loggedUser: req.user, studentList });
});
const handleBookListRender = asyncHandler(async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const pageSize = 6;
        const skip = (currentPage - 1) * pageSize;
        // Get the total count of books
        const totalBooks = await Book.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalBooks / pageSize);
        const bookList = await Book.aggregate([
            {
                $project: {
                    title: 1,
                    author: 1,
                    coverImage: 1,
                    bookUrl: 1,
                    course: 1
                }
            }, {
                $skip: skip
            }, {
                $limit: pageSize
            }
        ]);
        if (!bookList) return res.render('user/500', { req });
        return res.render('admin/bookList', { loggedUser: req.user, bookList, currentPage, totalPages });

    } catch (error) {
        console.log("Error fetching books list", error.message);
        return res.render('user/500', { req });
    }
});
const handleBlogListRender = asyncHandler(async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const pageSize = 6;
        const skip = (currentPage - 1) * pageSize;
        // Get the total count of blogs
        const totalBlogs = await Blog.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalBlogs / pageSize);

        const blogList = await Blog.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "writer",
                    foreignField: "_id",
                    as: "writerInfo"
                }
            },
            {
                $unwind: "$writerInfo"
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    content: 1,
                    createdAt: 1,
                    "writerInfo.fullName": 1,
                    "writerInfo.avatar": 1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            }
        ]);
        req.flash('success', "Blogs fetched successfully");
        return res.render('admin/blogList', { loggedUser: req.user, blogList, currentPage, totalPages });


    } catch (error) {
        console.log("Error fetching blogs", error);
        req.flash('error', 'Error fetching blogs');
        return res.status(500).redirect('/');
    }
});
const handleNoteListRender = asyncHandler(async (req, res) => {
    return res.render('admin/noteList', { loggedUser: req.user })
})
const handleUploadBlogRender = (req, res) => {
    return res.render('admin/uploadBlog', { loggedUser: req.user });
}
const handleRenderBlogReadPage = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(err => err.msg).join(' '));
        return res.status(400).redirect('/blogs');
    }

    const { id } = req.query;

    try {
        const blog = await Blog.findById(id).populate('writer', 'fullName email avatar'); // Assuming 'writer' is a reference field in Blog model

        if (!blog) {
            req.flash('error', 'Blog not found');
            return res.status(404).redirect('/blogs');
        }
        res.render('user/blogRead', { req, blog });

    } catch (error) {
        console.error(error);
        req.flash('error', 'Error while fetching the blog');
        return res.status(500).redirect('/blogs');
    }
});

module.exports = {
    handleUserHomePage,
    handleUserProfilePage,
    handleBooksPage,
    handleBlogPage,
    handleLoginRender,
    handleAdminDashboardRender,
    handleAdminProfileRender,
    handleAdminListRender,
    handleStudentListRender,
    handleUploadBlogRender,
    handleBlogListRender,
    handleBookListRender,
    handleNoteListRender,
    handleRenderBlogReadPage
}