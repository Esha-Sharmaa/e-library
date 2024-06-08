const { Router } = require('express');
const upload = require('../middlewares/multer.middleware.js');
const validateRegisterUser = require('../validators/validateRegisterUser.js');
const validateUpdateUser = require("../validators/validateUpdateUser.js");
const validateDeleteUser = require("../validators/validateDeleteUser.js");
const {
    registerUser,
    loginUser,
    updateUserAvatar,
    changeUserPassword,
    getUserInfo,
    refreshAccessToken,
    updateUserDetails,
    logoutUser,
    deleteUser
} = require("../controller/user.controller.js");
const verifyJWT = require('../middlewares/auth.middleware.js');
const isAdmin = require("../middlewares/auth.middleware.js");

const router = Router();
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser)
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeUserPassword);
router.route("/update-details").post(verifyJWT, validateUpdateUser, updateUserDetails);
router.route("/user-info").get(verifyJWT, getUserInfo);
router.route("/register").post(verifyJWT, isAdmin, upload.single('avatar'), validateRegisterUser, registerUser);
router.route("/update-avatar").post(upload.single('avatar'), verifyJWT, updateUserAvatar);
router.route("/delete-user").get(verifyJWT, isAdmin, validateDeleteUser, deleteUser);

module.exports = router;