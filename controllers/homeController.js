const customPromise = require("../middlewares/customPromise");

exports.home = customPromise(async (req, res) => {
	res.status(200).json({
		success: true,
		message: "Hello from API",
	});
});

exports.homeDummy = customPromise((req, res) => {
	res.status(200).json({
		success: true,
		message: "Dummy API Endpoint",
	});
});
