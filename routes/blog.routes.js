const { Router } = require("express");
const verifyJWT = require("../middlewares/auth.middleware");
const { addBlog, removeBlog, fetchAllBlogs } = require("../controller/blog.controller");
const isAdmin = require("../middlewares/auth.middleware.js");

const router = Router();
router.route('/add-blog').post(verifyJWT, addBlog);
router.route("/delete-blog").get(verifyJWT, isAdmin, removeBlog);
module.exports = router;