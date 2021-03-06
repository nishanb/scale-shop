module.exports = (func) => (req, res, next) => {
	Promise.resolve(func(req, res, next)).catch((err) => {
		if (err.warn) {
			err.warn(res);
		} else {
			console.log(err);
			res.status(400).json({ success: false, message: "Invalid request : " + err });
		}
	});
};
