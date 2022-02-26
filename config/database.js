const mongoose = require("mongoose");

module.exports = () => {
	mongoose
		.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(console.log("Connected to DB succesffully"))
		.catch((err) => {
			console.log("Failed to connect to DB");
			console.log(err);
			process.exit(1);
		});
};
