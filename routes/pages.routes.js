const { Router } = require('express');
const {
    handleUserHomePage,
    handleUserProfilePage,
    handleLoginRender,
    handleAdminDashboardRender,
    handleAdminProfileRender,
    handleAdminListRender,
    handleStudentListRender,
    handleUploadBlogRender,
    handleBlogListRender,
    handleBookListRender
} = require("../controller/pages.controller.js");

const verifyJWT = require('../middlewares/auth.middleware.js');
const isAdmin = require("../middlewares/isAdmin.middleware.js");

const router = Router();

// user page routes
router.route('/').get(handleUserHomePage);
router.route('/login').get(handleLoginRender);
router.route('/books').get(verifyJWT, handleBookListRender);
router.route('/blogs').get(verifyJWT, handleBlogListRender);
router.route('/profile').get(verifyJWT,handleUserProfilePage)

// admin page routes
router.route('/admin-dashboard').get(verifyJWT, isAdmin, handleAdminDashboardRender);
router.route('/admin-profile').get(verifyJWT, isAdmin, handleAdminProfileRender);
router.route('/admin-list').get(verifyJWT, isAdmin, handleAdminListRender);
router.route('/student-list').get(verifyJWT, isAdmin, handleStudentListRender);
router.route('/book-list').get(verifyJWT, isAdmin, handleBookListRender);
router.route('/blog-list').get(verifyJWT, isAdmin, handleBlogListRender);

// common for both 
router.route('/upload-blog').get(verifyJWT, handleUploadBlogRender);

module.exports = router;