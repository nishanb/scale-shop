const generateCookieToken = require("../utils/cookieToken");
const User = require("./../models/User");
const cloudinary = require("cloudinary");
const requestHandler = require("../middlewares/requestHandler");
const CustomError = require("../utils/CustomError");
const sendEmail = require("./../utils/emailHelper");
const crypto = require("crypto");

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

	const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${forogotToken}`;

	const emailOption = {
		to: email,
		subject: "SiteShop Reset Passwrod Reuqest ",
		text: "Your Password reset url is " + resetUrl,
	};

	try {
		await sendEmail(emailOption);
		res.status(200).json({ success: true, message: "Reset token sent to email " + email });
	} catch (err) {
		//cleanup db in case of failed to send email
		user.forgotPasswordToken = undefined;
		user.forgotPasswordExpiary = undefined;
		await user.save({ validateBeforeSave: false });
		throw new CustomError("Failed to send email");
	}
});

module.exports.validateResetPassword = requestHandler(async (req, res, next) => {
	const token = req.params.token;
	const encryptedToken = crypto.createHash("sha256").update(token).digest("hex");

	const user = await User.findOne({
		forgotPasswordToken: encryptedToken,
		forgotPasswordExpiary: { $gt: Date.now() },
	});

	if (!user) {
		throw new CustomError("Token is invalid or expried");
	}

	if (req.body.password == req.body.confPassword) {
		throw new CustomError("Password mismatch");
	}

	user.password = req.body.password;
	user.forgotPasswordToken = undefined;
	user.forgotPasswordExpiary = undefined;
	await user.save();

	res.status(200).json({ success: true, message: "Password is reset" });
});

module.exports.getUser = requestHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);
	res.status(200).json({ success: true, user });
});

module.exports.updatePassword = requestHandler(async (req, res, next) => {
	const { password, oldPassword } = req.body;

	if (!password || !oldPassword) {
		throw new CustomError("All fields are required");
	}

	const user = await User.findById(req.user.id).select("+password");

	const oldPasswordMatched = await user.IsvalidPassword(oldPassword);

	if (!oldPasswordMatched) {
		throw new CustomError("Old Password did not match");
	}

	user.password = password;

	await user.save();

	res.status(200).json({ success: true, message: "Password update successdfull" });
});

module.exports.updateUser = requestHandler(async (req, res, next) => {
	if (!req.body.name || !req.body.email) {
		throw new CustomError("name and email fields are missing");
	}

	const user = await User.findById(req.user.id);

	let newData = {
		name: req.body.name,
		email: req.body.email,
	};

	//upload new photo
	if (req.files.photo != undefined) {
		await cloudinary.v2.uploader.destroy(user.photo.id);

		fileUploadResult = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
			folder: "Users",
			width: 150,
			crop: "scale",
		});

		user.photo.id = fileUploadResult.public_id;
		user.photo.secure_url = fileUploadResult.secure_url;

		newData.photo = {
			id: fileUploadResult ? fileUploadResult.public_id : undefined,
			secure_url: fileUploadResult ? fileUploadResult.secure_url : undefined,
		};
	}

	const updatedUser = await User.findByIdAndUpdate(req.user.id, newData, {
		new: true,
		runValidators: true,
		useFindAndModify: false,
	});

	res.status(200).json({ success: true, message: "User update is successfull", user: updatedUser });
});
