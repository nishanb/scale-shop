const express = require("express");
const router = express.Router();
const {
	signup,
	login,
	logout,
	getUser,
	forgotPassword,
	validateResetPassword,
	updatePassword,
	updateUser,
	adminAllUser,
} = require("../controllers/userController");
const { customRole } = require("../middlewares/role");
const { isLoggedIn } = require("../middlewares/user");

//auth related
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

//user related
router.route("/dashboard").get(isLoggedIn, getUser);
router.route("/").patch(isLoggedIn, updateUser);
router.route("/password").post(isLoggedIn, updatePassword);

//password related
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(validateResetPassword);

//Admin Routes
router.route("/admin/users").get(isLoggedIn, customRole("admin"), adminAllUser);

module.exports = router;
