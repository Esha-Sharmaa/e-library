const User = require('../models/user.model');
const Blog = require("../models/blog.model.js");
const Book = require("../models/book.model.js");
const asyncHandler = require('../utils/asyncHandler.js');


const handleUserHomePage = (req, res) => {
    res.render('user/index', { req });
}
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
        if (req?.user?.role === 'Admin') return res.render('admin/bookList', { loggedUser: req.user, bookList, currentPage, totalPages });
        else return res.render('user/books', { loggedUser: req.user, bookList });

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
        if (req?.user?.role === 'Admin') return res.render('admin/blogList', { loggedUser: req.user, blogList, currentPage, totalPages });
        else return res.render('user/blogs', { loggedUser: req.user, blogList });

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

module.exports = {
    handleUserHomePage,
    handleLoginRender,
    handleAdminDashboardRender,
    handleAdminProfileRender,
    handleAdminListRender,
    handleStudentListRender,
    handleUploadBlogRender,
    handleBlogListRender,
    handleBookListRender, handleNoteListRender
}