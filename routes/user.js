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
	mananagerAllUser,
	adminReadUser,
	adminUpdateUser,
	adminDeleteUser,
} = require("../controllers/userController");
const { customRole } = require("../middlewares/role");
const { isLoggedIn } = require("../middlewares/user");

const Role = {
	USER: "user",
	ADMIN: "admin",
	MANAGER: "manager",
};

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
router.route("/admin/users").get(isLoggedIn, customRole(Role.ADMIN), adminAllUser);
router
	.route("/admin/users/:id")
	.get(isLoggedIn, customRole(Role.ADMIN), adminReadUser)
	.put(isLoggedIn, customRole(Role.ADMIN), adminUpdateUser)
	.delete(isLoggedIn, customRole(Role.ADMIN), adminDeleteUser);

//Manager routes
router.route("/manager/users").get(isLoggedIn, customRole(Role.MANAGER, Role.ADMIN), mananagerAllUser);

module.exports = router;
