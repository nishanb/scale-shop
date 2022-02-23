const express = require("express");
const router = express.Router();
const { home, homeDummy } = require("../controllers/homeController");

//home route
router.route("/").get(home);
router.route("/homedummy").get(homeDummy);

module.exports = router;
