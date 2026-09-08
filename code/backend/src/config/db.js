// Real PostgreSQL connection pool, backed by DATABASE_URL.
// Owner: Vaibhav Budhia

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
