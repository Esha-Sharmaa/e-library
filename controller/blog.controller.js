const Blog = require('../models/blog.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { validationResult, matchedData } = require('express-validator');


const addBlog = asyncHandler(async (req, res) => {
    const { blogTitle, blogContent } = req.body;
    if (!blogTitle || !blogContent) {
        req.flash("errors", "Blog Title and content both are required");
        return res.status(400).redirect('/upload-blog');
    }
    const userId = req.user._id;

    const createdBlog = await Blog.create({
        title: blogTitle,
        content: blogContent,
        writer: userId
    });
    if (!createdBlog) {
        req.flash("errors", "Error while uploading your blog. Try again later");
        return res.status(500).redirect('/upload-blog');
    }
    req.flash("success", "Blog successfully created");
    res.status(200).redirect("/upload-blog");
});
const removeBlog = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("error", "Blog id is required");
        return res.status(400).redirect('/blog-list');
    }
    const { id } = req.query;
    const blog = await Blog.findOneAndDelete({ _id: id });

    if (!blog) {
        req.flash('error', 'Blog not found');
        return res.status(404).redirect('/blog-list');
    }

    req.flash('success', 'Blog deleted successfully');
    return res.status(400).redirect('/blog-list');
});

module.exports = {
    addBlog,
    removeBlog,
}