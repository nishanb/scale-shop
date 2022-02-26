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
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

//swagger docs
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//morgan middleware
app.use(morgan("tiny"));

app.set("view engine", "ejs");

app.get("/photo", (req, res) => {
	res.render("signup_test");
});
//routes middlewares
app.use("/api/v1", require("./routes/home"));
app.use("/api/v1/user", require("./routes/user"));

module.exports = app;
