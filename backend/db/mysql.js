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

// Create connection config without any password
const config = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  database: process.env.MYSQL_DATABASE || "user_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(config);

module.exports = pool;
