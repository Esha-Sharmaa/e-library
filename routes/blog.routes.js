const { Router } = require("express");
const verifyJWT = require("../middlewares/auth.middleware");
const { addBlog, removeBlog } = require("../controller/blog.controller");
const isAdmin = require("../middlewares/auth.middleware.js");
const validateId = require("../validators/validateId.js");
const validateBlog = require("../validators/validateBlog.js")

const router = Router();
router.route('/add-blog').post(verifyJWT, validateBlog, addBlog);
router.route("/delete-blog").get(verifyJWT, isAdmin, validateId, removeBlog);
module.exports = router;