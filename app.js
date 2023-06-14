require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const cors = require("cors");
const file = fs.readFileSync("./documentationSwagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
const expressListRoutes = require("express-list-routes");
const bodyParser = require("body-parser");

const app = express();
const router = require("./routes");

app.use(bodyParser.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(router);

// 404
app.use((req, res, next) => {
  return res.status(404).json({
    message: "Not Found",
  });
});

// 500
app.use((err, req, res, next) => {
  return res.status(500).json({
    message: err.message,
  });
});

module.exports = app