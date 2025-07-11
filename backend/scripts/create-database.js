const mysql = require("mysql2/promise");
require("dotenv").config();

// Database configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USERNAME || "root",
  password: process.env.MYSQL_PASSWORD || "",
};

const dbName = process.env.MYSQL_DATABASE || "shopee_clone";

async function checkDatabaseConnection() {
  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection({
      ...dbConfig,
      database: dbName,
    });

    console.log(`Successfully connected to database '${dbName}'.`);
  } catch (error) {
    console.error(`Error connecting to database '${dbName}':`, error);
    console.log(
      "Please ensure your MySQL server is running and the database exists."
    );
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
checkDatabaseConnection();
