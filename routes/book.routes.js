const { Router } = require("express");
const upload = require("../middlewares/multer.middleware.js");
const validateUploadBookDetails = require('../validators/validateUploadBook.js');
const validateId = require("../validators/validateId.js");
const verifyJWT = require("../middlewares/auth.middleware.js");
const isAdmin = require('../middlewares/isAdmin.middleware.js');
const { addBook, deleteBook } = require("../controller/book.controller.js");
const router = Router();

router.route("/upload-book").post(
    verifyJWT,
    isAdmin,
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        },
        {
            name: "book",
            maxCount: 1
        }
    ]),
    validateUploadBookDetails,
    addBook);
router.route("/delete-book").get(verifyJWT,
    isAdmin, validateId, deleteBook);
module.exports = router;