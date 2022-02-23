const express = require("express");
const app = express();

//middlewares
app.use(express.json());

//import all routes
const home = require("./routes/home");

//routes middlewares
app.use("/api/v1", home);

module.exports = app;
