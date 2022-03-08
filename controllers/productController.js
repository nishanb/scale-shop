const requestHandler = require("../middlewares/requestHandler");
const Product = require("../models/Product");
const CustomError = require("../utils/CustomError");
const cloudinary = require("cloudinary");

module.exports.test = requestHandler(async (req, res) => {
	console.log(req.query);
	res.status(200).json({
		success: true,
		message: "Hello from product page",
	});
});

module.exports.createProduct = requestHandler(async (req, res, next) => {
	const { name, description, price, category, brand, stock } = req.body;

	if (!name | !description | !price | !category | !brand | !stock) {
		throw new CustomError("All input fields are required");
	}

	if (!req.files) {
		throw new CustomError("Product image is required");
	}

	let files = [];

	for (let index = 0; index < req.files.photos.length; index++) {
		fileUploadResult = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath, {
			folder: "Products",
		});

		files.push({
			id: fileUploadResult.public_id,
			secure_url: fileUploadResult.secure_url,
		});
	}

	req.body.photos = files;
	req.body.user = req.user._id;

	const product = await Product.create(req.body);

	res.status(200).json({
		success: true,
		message: "Hello from product page",
		product,
	});
});
