const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "please provide product name"],
		trim: true,
		maxlength: [120, "Product name should not be more than 120 chars"],
	},
	price: {
		type: Number,
		required: [true, "please provide product price"],
		maxlength: [5, "Product price should not be more than 99999"],
	},
	description: {
		type: String,
		required: [true, "please provide product description"],
	},
	photos: [
		{
			id: {
				type: String,
				required: true,
			},
			secure_url: {
				type: String,
				required: true,
			},
		},
	],
	category: {
		type: String,
		required: [true, "please select category from - short-seelves, long-sleeves, swaet-shirts, hoodies"],
		enum: {
			values: ["short-sleeves", "long-sleeves", "sweat-shirts", "hoodies"],
			message: "please select category from - short-seelves, long-sleeves, swaet-shirts, hoodie",
		},
	},
	brand: {
		type: String,
		required: [true, "please provide brand for product"],
	},
	ratings: {
		type: Number,
		default: 0,
	},
	numOfReviews: {
		type: Number,
		default: 0,
	},
	reviews: [
		{
			user: {
				type: mongoose.Schema.ObjectId,
				ref: "User",
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			rating: {
				type: Number,
				required: true,
			},
			comment: {
				type: String,
				required: true,
			},
		},
	],
	stock: {
		type: Number,
		default: 0,
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Product", productSchema);
