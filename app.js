require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const cors = require("cors");
const file = fs.readFileSync("./documentationSwagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);
const bodyParser = require("body-parser");
const helmet = require('helmet')
const app = express();
const router = require("./routes");

app.use(bodyParser.json());
app.use(helmet())
app.use(cors());
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(router);

// 404
app.use((req, res) => {
  return res.status(404).json({
      status: false,
      message: 'Not Found',
      err: `Cannot find ${req.url}`,
      data: null,
  });
});

// 500
app.use((err, req, res) => {
  console.log(err);
  return res.status(500).json({
      status: false,
      message: 'Internal Server Error',
      err: err.message,
      data: null,
  });
});

// test otp
// const otpGenerator = require('otp-generator');
// const otp = otpGenerator.generate(6, {
//   digits: true,
//   alphabets: false,
//   upperCase: false,
//   specialChars: false,
// });
// console.log("Kode OTP:", otp);

module.exports = app;