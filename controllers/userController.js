const generateCookieToken = require("../utils/cookieToken");
const User = require("./../models/User");
const cloudinary = require("cloudinary");
const requestHandler = require("../middlewares/requestHandler");
const CustomError = require("../utils/CustomError");
const sendEmail = require("./../utils/emailHelper");

module.exports.signup = requestHandler(async (req, res, next) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		throw new CustomError("Required fields are missing");
	}

	let fileUploadResult;

	if (req.files && req.files.photo) {
		let photo = req.files.photo;

		fileUploadResult = await cloudinary.v2.uploader.upload(photo.tempFilePath, {
			folder: "Users",
			width: 150,
			crop: "scale",
		});
	}

	const user = await User.create({
		name,
		email,
		password,
		photo: {
			id: fileUploadResult ? fileUploadResult.public_id : undefined,
			secure_url: fileUploadResult ? fileUploadResult.secure_url : undefined,
		},
	});

	return generateCookieToken(user, res);
});

module.exports.login = requestHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new CustomError("Email and password is required");
	}

	const user = await User.findOne({ email: email }).select("+password");

	if (!user) {
		throw new CustomError("User not found");
	}

	const isPasswordMatch = await user.IsvalidPassword(password);

	if (!isPasswordMatch) {
		throw new CustomError("Email or password is incorrect");
	}

	return generateCookieToken(user, res);
});

module.exports.logout = requestHandler(async (req, res, next) => {
	res.cookie("token", null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	res.status(200).json({ success: true, message: "logout success" });
});

module.exports.getUser = (req, res, next) => {
	res.sendStatus(200);
};

module.exports.forgotPassword = requestHandler(async (req, res, next) => {
	const { email } = req.body;

	console.log(email);
	if (!email) {
		throw new CustomError("Email is required");
	}

	const user = await User.findOne({ email: email });

	if (!user) {
		throw new CustomError("User not found");
	}

	const forogotToken = await user.getForgotPasswordToken();

	await user.save({ validateBeforeSave: false });

	const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forogotToken}`;

	const emailOption = {
		to: email,
		subject: "SiteShop Reset Passwrod Reuqest ",
		text: "Your Password reset url is " + resetUrl,
	};

	try {
		await sendEmail(emailOption);
		res.status(200).json({ success: true, message: "Reset token sent to email" });
	} catch (err) {
		user.forgotPasswordToken = undefined;
		user.forgotPasswordExpiary = undefined;
		await user.save({ validateBeforeSave: false });
		throw new CustomError("Failed to send email");
	}
});

module.exports.validateResetPassword = (req, res, next) => {
	res.sendStatus(200);
};

module.exports.updatePassword = (req, res, next) => {
	res.sendStatus(200);
};

module.exports.updateUser = (req, res, next) => {
	res.sendStatus(200);
};
