const express = require("express");
const router = express.Router();
const { test } = require("../controllers/productController");

router.route("/").get(test);

module.exports = router;
