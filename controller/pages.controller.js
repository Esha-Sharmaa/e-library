const User = require('../models/user.model');
const Blog = require("../models/blog.model.js");
const asyncHandler = require('../utils/asyncHandler.js');


const handleUserHomePage = (req, res) => {
    res.render('user/index');
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
const handleUploadBlogRender = (req, res) => {
    return res.render('admin/uploadBlog', { loggedUser: req.user });
}
const fetchAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.aggregate([
            {
                $lookup: {
                    from: 'users', // Collection name
                    localField: 'writer',
                    foreignField: '_id',
                    as: 'writerInfo'
                }
            },
            {
                $unwind: '$writerInfo' // Unwind the writer info array
            },
            {
                $project: {
                    title: 1,
                    content: 1,
                    'writerInfo._id': 1,
                    'writerInfo.avatar': 1,
                    'writerInfo.fullName': 1
                }
            }
        ]);
        req.flash('success', 'Blogs fetched successfully');
        return res.status(200).render("admin/blogList", { loggedUser: req.user, blogList: blogs });
    } catch (error) {
        req.flash('error', 'Error fetching blogs');
        return res.status(500).redirect('/blog-list');
    }
});
module.exports = {
    handleUserHomePage,
    handleLoginRender,
    handleAdminDashboardRender,
    handleAdminProfileRender,
    handleAdminListRender,
    handleStudentListRender,
    handleUploadBlogRender,
    fetchAllBlogs
}