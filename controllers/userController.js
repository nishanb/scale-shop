const generateCookieToken = require("../utils/cookieToken");
const User = require("./../models/User");
const cloudinary = require("cloudinary");

module.exports.signup = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			res.status(400).json({ message: "Required fields are missing" });
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
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
};

module.exports.login = (req, res, next) => {
	res.sendStatus(200);
};

module.exports.logout = (req, res, next) => {
	res.sendStatus(200);
};

module.exports.getUser = (req, res, next) => {
	res.sendStatus(200);
};

module.exports.forgotPassword = (req, res, next) => {
	res.sendStatus(200);
};

module.exports.validateResetPassword = (req, res, next) => {
	res.sendStatus(200);
};

module.exports.updatePassword = (req, res, next) => {
	res.sendStatus(200);
};

module.exports.updateUser = (req, res, next) => {
	res.sendStatus(200);
};
