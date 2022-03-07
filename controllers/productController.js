const requestHandler = require("../middlewares/requestHandler");

module.exports.test = requestHandler(async (req, res) => {
	res.status(200).json({
		success: true,
		message: "Hello from product page",
	});
});
