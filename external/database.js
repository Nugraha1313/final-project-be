require("dotenv").config();
const {
  DB_HOST,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DIALECT = "postgres",
  DB_PORT = 5432,
} = process.env;

module.exports = {
  development: {
    host: DB_HOST,
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: DB_DIALECT,
    port: DB_PORT,
  },
  test: {
    host: DB_HOST,
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: DB_DIALECT,
    port: DB_PORT,
  },
  production: {
    host: DB_HOST,
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    dialect: DB_DIALECT,
    port: DB_PORT,
  },
};
