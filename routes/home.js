const express = require("express");
const router = express.Router();
const { home } = require("../controllers/homeController");

//home route
router.route("/").get(home);

module.exports = router;
