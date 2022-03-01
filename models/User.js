const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: [5, "Name should be above 5 characters"],
		maxlength: [40, "Name should be under 40 characters"],
		required: [true, "Please provide a name"],
	},
	email: {
		type: String,
		required: [true, "Please provide a email"],
		validate: [validator.isEmail, "Please enter email in correct format"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: [5, "minimum length should be atleast 5 char"],
		select: false,
	},
	role: {
		type: String,
		default: "user",
	},
	photo: {
		id: {
			type: String,
			required: false,
		},
		secure_url: {
			type: String,
			required: false,
		},
	},
	forgotPasswordToken: {
		type: String,
		required: false,
	},
	forgotPasswordExpiary: {
		type: Date,
		required: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

//encrypt password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}

	this.password = await bcrypt.hash(this.password, 10);
	return next();
});

//validate password with login password
userSchema.methods.IsvalidPassword = async function (sentPassword) {
	return await bcrypt.compare(sentPassword, this.password);
};

//sign and return jwt tokens
userSchema.methods.getJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIARY,
	});
};

userSchema.methods.isJwtTokenValid = function (token) {
	return jwt.verify(token);
};

//genrate forgot password token
userSchema.methods.getForgotPasswordToken = function () {
	const token = crypto.randomBytes(20).toString("hex");

	//getting hash
	this.forgotPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

	//set expiary time (5 Minutes)
	this.forgotPasswordExpiary = Date.now() + 5 * 60 * 1000;

	return token;
};

module.exports = mongoose.model("User", userSchema);
