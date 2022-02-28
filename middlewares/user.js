const User = require("../models/User");
const requestHandler = require("../middlewares/requestHandler");
const CustomError = require("../utils/CustomError");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = requestHandler(async (req, res, next) => {
	//web app in cookies and mobile app are in header
	const token = req.cookies.token || req.header("authorization").replace("Bearer ", "");

	if (!token) {
		throw new CustomError("Login first to access the page", 403);
	}

	//decode and get user
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	req.user = await User.findById(decoded.id);
	next();
});
