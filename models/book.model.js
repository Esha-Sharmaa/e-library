const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book Title is required"]
    },
    author: {
        type: true,
        required: [true, 'Book Author is required']
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);