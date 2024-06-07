const { Router } = require('express');
const upload = require('../middlewares/multer.middleware.js');
const validateRegisterUser = require('../validators/validateRegisterUser.js');
const validateUpdateUser = require("../validators/validateUpdateUser.js")
const {
    registerUser,
    loginUser,
    updateUserAvatar,
    changeUserPassword,
    getUserInfo,
    refreshAccessToken,
    updateUserDetails
} = require("../controller/user.controller.js");
const verifyJWT = require('../middlewares/auth.middleware.js');

const router = Router();
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeUserPassword);
router.route("/update-details").patch(verifyJWT, validateUpdateUser, updateUserDetails);
router.route("/user-info").get(verifyJWT, getUserInfo);
router.route("/register").post(upload.single('avatar'), validateRegisterUser, registerUser);
router.route("/update-avatar").post(upload.single('avatar'), verifyJWT, updateUserAvatar);

module.exports = router;