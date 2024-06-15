const { Router } = require('express');
const {
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
} = require("../controller/pages.controller.js");

const verifyJWT = require('../middlewares/auth.middleware.js');
const isAdmin = require("../middlewares/isAdmin.middleware.js");

const router = Router();

router.route('/').get(handleUserHomePage);
router.route('/login').get(handleLoginRender);
router.route('/books').get(verifyJWT, handleBooksRender);
router.route('/admin-dashboard').get(verifyJWT, isAdmin, handleAdminDashboardRender);
router.route('/admin-profile').get(verifyJWT, isAdmin, handleAdminProfileRender);
router.route('/admin-list').get(verifyJWT, isAdmin, handleAdminListRender);
router.route('/student-list').get(verifyJWT, isAdmin, handleStudentListRender);
router.route('/book-list').get(verifyJWT, isAdmin, handleBookListRender);
router.route('/upload-blog').get(verifyJWT, handleUploadBlogRender);
router.route('/blog-list').get(verifyJWT, isAdmin, fetchAllBlogs);
router.route('/blogs').get(verifyJWT, fetchAllBlogs);
module.exports = router;