const mysql = require("mysql2/promise");
const path = require("path");

// Load environment variables with explicit path
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Add debugging
console.log("MySQL config - Environment check:");
console.log("MYSQL_HOST:", process.env.MYSQL_HOST);
console.log("MYSQL_USER:", process.env.MYSQL_USER);
console.log("MYSQL_PASSWORD set:", !!process.env.MYSQL_PASSWORD);
console.log("MYSQL_DATABASE:", process.env.MYSQL_DATABASE);

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "khoi123z",
  database: process.env.MYSQL_DATABASE || "shopee_clone",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
