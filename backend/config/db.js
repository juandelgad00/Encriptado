const { Pool } = require('pg');

const pool = new Pool({
  user: 'grupo4',
  host: 'hashing-bd.cw94q8sgiyyo.us-east-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'grupo4_123',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;