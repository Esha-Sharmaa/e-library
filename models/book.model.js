const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book Title is required"]
    },
    author: {
        type: String,
        required: [true, 'Book Author is required']
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Uploader is required"]
    },
    coverImage: {
        type: String,
        require: [true, "Book Cover Image is required"]
    },
    bookUrl: {
        type: String,
        require: [true, "Book Cloud URL is required"],
    },
    course: {
        type: String,
        enum: ["MCA", "BCA", "MBA(E.Com)", "All", "General"],
        require: [true, "Related Course is required"]
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);