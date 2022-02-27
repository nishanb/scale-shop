class CustomError extends Error {
	constructor(message, code = 400) {
		super(message);
		this.code = code;
	}

	warn = (res) => {
		res.status(this.code).json({ message: this.message });
	};
}

module.exports = CustomError;
