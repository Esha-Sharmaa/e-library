const User = require('../models/user.model');
const asyncHandler = require('../utils/asyncHandler.js');
const handleUserHomePage = (req, res) => {
    res.render('user/index');
}
const handleLoginRender = (req, res) => {
    res.render('user/login');
}
const handleAdminDashboardRender = asyncHandler(async (req, res) => {
    const userList = await User.find();
    res.render('admin/dashboard', { loggedUser: req.user, userList });
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
module.exports = {
    handleUserHomePage,
    handleLoginRender,
    handleAdminDashboardRender,
    handleAdminProfileRender,
    handleAdminListRender,
    handleStudentListRender,
    handleUploadBlogRender
}