require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const Sentry = require("@sentry/node");
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

const { SENTRY_DSN, ENVIRONMENT } = process.env;

Sentry.init({
  environment: ENVIRONMENT,
  dsn: SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.use(bodyParser.json());
app.use(helmet())
app.use(cors());
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// sentry handler
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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

module.exports = app;