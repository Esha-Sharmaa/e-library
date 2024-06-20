const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 100);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 15 * 1024 * 1024
    }
});
module.exports = upload;