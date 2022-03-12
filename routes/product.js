const express = require("express");
const router = express.Router();
const { test, createProduct, readAllProduct } = require("../controllers/productController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/").post(isLoggedIn, createProduct);
router.route("/").get(isLoggedIn, readAllProduct);

module.exports = router;
