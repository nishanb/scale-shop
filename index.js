const app = require("./app");
const dotenv = require("dotenv");
const connectWithDb = require("./config/database");
const cloudinary = require("cloudinary");

//setup helpers
dotenv.config();

//Connect to DB
connectWithDb();

//Setup cloduinary config
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Start express server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Application is up and running in ${PORT}`);
});
