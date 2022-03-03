const CustomError = require("../utils/CustomError");

exports.customRole = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			throw new CustomError("Role did not match");
		}
		next();
	};
};
