const {
    PGHOST = 'localhost',
    PGUSER,
    PGDATABASE,
    PGPASSWORD,
    PGPORT = 5432,
} = process.env;

const {Client} = require('pg');
const client = new Client({
    host: PGHOST,
    user: PGUSER,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: PGPORT,
});

client.connect();

module.exports = client;