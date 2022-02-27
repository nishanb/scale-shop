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

//auth related
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

//user related
router.route("/").get(getUser);
router.route("/").patch(updateUser);
router.route("/password").patch(updatePassword);

//password related
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(validateResetPassword);

module.exports = router;
