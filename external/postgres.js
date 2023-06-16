const {Sequelize, QueryTypes} = require('sequelize');
const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_HOST = 'localhost',
    DB_DIALECT = 'postgres',
    DB_PORT = 5432,
} = process.env;

// Create a new Sequelize instance
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT
});

module.exports = {sequelize, queryTypes: QueryTypes};