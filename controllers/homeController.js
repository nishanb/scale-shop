const customPromise = require("../middlewares/customPromise");

module.exports.home = customPromise(async (req, res) => {
	res.status(200).json({
		success: true,
		message: "Hello from API",
	});
});
