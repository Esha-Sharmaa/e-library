const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Blog Title is required"]
    },
    content: {
        type: String,
        required: [true, "Blog Content is required"]
    },
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Blog Writer is required"]
    }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);