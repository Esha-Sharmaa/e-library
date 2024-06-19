const Blog = require('../models/blog.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { validationResult, matchedData } = require('express-validator');


const addBlog = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        req.flash("error", errors.array().map(err => err.msg).join(' '));
        if (req.user.role === "Admin") return res.status(400).redirect('/upload-blog');
        else return res.status(400).redirect('/blogs');
    }

    const { blogTitle, blogContent } = matchedData(req, { locations: ['body'] });
    const userId = req.user._id;

    try {
        const createdBlog = await Blog.create({
            title: blogTitle,
            content: blogContent,
            writer: userId
        });

        req.flash("success", "Blog successfully created");
        if (req.user.role === "Admin") return res.status(400).redirect('/upload-blog');
        else return res.status(400).redirect('/blogs');
    } catch (error) {
        console.log(error);
        req.flash("error", "Error while uploading your blog. Try again later");
        if (req.user.role === "Admin") return res.status(400).redirect('/upload-blog');
        else return res.status(400).redirect('/blogs');
    }
});
const removeBlog = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash("error", errors.array().map(err => err.msg).join(' '));
        return res.status(400).redirect('/blog-list');
    }

    const { id } = req.query;
    const blog = await Blog.findOneAndDelete({ _id: id });

    if (!blog) {
        req.flash('error', 'Blog not found');
        return res.status(404).redirect('/blog-list');
    }

    req.flash('success', 'Blog deleted successfully');
    return res.status(200).redirect('/blog-list');
});

module.exports = {
    addBlog,
    removeBlog,
}