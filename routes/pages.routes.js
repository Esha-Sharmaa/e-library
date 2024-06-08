const { Router } = require('express');
const {
    handleUserHomePage,
    handleLoginRender,
    handleAdminDashboardRender,
    handleAdminProfileRender,
    handleAdminListRender,
    handleStudentListRender,
    handleUploadBlogRender,
    fetchAllBlogs
} = require("../controller/pages.controller.js");
const verifyJWT = require('../middlewares/auth.middleware.js');
const isAdmin = require("../middlewares/auth.middleware.js");
const router = Router();

router.route('/').get(handleUserHomePage);
router.route('/login').get(handleLoginRender);
router.route('/admin-dashboard').get(verifyJWT, isAdmin, handleAdminDashboardRender);
router.route('/admin-profile').get(verifyJWT, isAdmin, handleAdminProfileRender);
router.route('/admin-list').get(verifyJWT, isAdmin, handleAdminListRender);
router.route('/student-list').get(verifyJWT, isAdmin, handleStudentListRender);
router.route('/upload-blog').get(verifyJWT, handleUploadBlogRender);
router.route('/blog-list').get(verifyJWT, fetchAllBlogs);
module.exports = router;