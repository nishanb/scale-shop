const CustomError = require("../utils/CustomError");

exports.customRole = (...roles) => {
	return (req, res, next) => {
		console.log(roles, req.user.role);
		if (!roles.includes(req.user.role)) {
			throw new CustomError("Role did not match");
		}
		next();
	};
};
