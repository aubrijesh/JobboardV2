const mysql = require('mysql2/promise');
require('dotenv').config()

// Update these with your local MySQL credentials
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

const executeQuery = async (query, params) => {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.execute(query, params);
    return [rows, fields];
  } finally {
    connection.release();
  }
};

module.exports = {
  executeQuery,
};