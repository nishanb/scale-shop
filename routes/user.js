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
} = require("../controllers/userController");

//user related
router.route("/").get(getUser);
router.route("/").patch(updateUser);
router.route("/password").patch(updatePassword);

//auth related
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

//password related
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(validateResetPassword);

module.exports = router;
