const User = require('../models/user.model');
const Blog = require("../models/blog.model.js");
const asyncHandler = require('../utils/asyncHandler.js');


const handleUserHomePage = (req, res) => {
    res.render('user/index', { req });
}
const handleLoginRender = (req, res) => {
    res.render('user/login');
}
const handleAdminDashboardRender = asyncHandler(async (req, res) => {
    const userList = await User.find();
    const blogList = await Blog.find();
    res.render('admin/dashboard', { loggedUser: req.user, userList, blogList });
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
    res.render("admin/bookList", { loggedUser: req.user });
});

const handleUploadBlogRender = (req, res) => {
    return res.render('admin/uploadBlog', { loggedUser: req.user });
}

const fetchAllBlogs = asyncHandler(async (req, res) => {
    try {
        const currentPage = parseInt(req.query.page) || 1;
        const pageSize = 4;
        const skip = (currentPage - 1) * pageSize;
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
        if (req?.user?.role === 'Admin') return res.render('admin/blogList', { loggedUser: req.user, blogList });
        else return res.render('user/blogs', { loggedUser: req.user, blogList });

    } catch (error) {
        console.log("Error fetching blogs", error);
        req.flash('error', 'Error fetching blogs');
        return res.status(500).redirect('/');
    }
});
const handleBooksRender = (req, res) => {
    return res.render('user/books', { loggedUser: req.user });
}

module.exports = {
    handleUserHomePage,
    handleLoginRender,
    handleAdminDashboardRender,
    handleAdminProfileRender,
    handleAdminListRender,
    handleStudentListRender,
    handleUploadBlogRender,
    fetchAllBlogs,
    handleBooksRender,
    handleBookListRender
}