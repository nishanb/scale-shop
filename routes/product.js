const express = require("express");
const router = express.Router();
const { test, createProduct } = require("../controllers/productController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/").get(test);
router.route("/").post(isLoggedIn, createProduct);

module.exports = router;
