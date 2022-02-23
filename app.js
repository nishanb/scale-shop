const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

//regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie and file middleware
app.use(cookieParser());
app.use(fileUpload());

//swagger docs
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//morgan middleware
app.use(morgan("tiny"));

//import all routes
const home = require("./routes/home");

//routes middlewares
app.use("/api/v1", home);

module.exports = app;
