const { Router } = require('express');
const {
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
} = require("../controller/pages.controller.js");

const verifyJWT = require('../middlewares/auth.middleware.js');
const isAdmin = require("../middlewares/isAdmin.middleware.js");
const validateId = require("../validators/validateId.js");
const router = Router();

// user page routes
router.route('/').get(handleUserHomePage);
router.route('/login').get(handleLoginRender);
router.route('/books').get(verifyJWT, handleBooksPage);
router.route('/blogs').get(verifyJWT, handleBlogPage);
router.route('/profile').get(verifyJWT, handleUserProfilePage)


// admin page routes
router.route('/admin-dashboard').get(verifyJWT, isAdmin, handleAdminDashboardRender);
router.route('/admin-profile').get(verifyJWT, isAdmin, handleAdminProfileRender);
router.route('/admin-list').get(verifyJWT, isAdmin, handleAdminListRender);
router.route('/student-list').get(verifyJWT, isAdmin, handleStudentListRender);
router.route('/book-list').get(verifyJWT, isAdmin, handleBookListRender);
router.route('/blog-list').get(verifyJWT, isAdmin, handleBlogListRender);
router.route('/note-list').get(verifyJWT, handleNoteListRender);

// common for both 
router.route('/upload-blog').get(verifyJWT, handleUploadBlogRender);
router.route('/read-blog').get(verifyJWT, validateId, handleRenderBlogReadPage);


module.exports = router;