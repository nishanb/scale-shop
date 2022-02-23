const app = require("./app");
const dotenv = require("dotenv");

//setup helpers
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Application is up and running in ${PORT}`);
});
