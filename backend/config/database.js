// Load environment variables
require("dotenv").config();

const { Sequelize } = require("sequelize");

// Database configuration
const sequelize = new Sequelize({
  database: process.env.MYSQL_DATABASE || "shopee_clone",
  username: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  host: process.env.MYSQL_HOST || "localhost",
  port: process.env.MYSQL_PORT || 3306,
  dialect: "mysql",
  dialectOptions: {
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

module.exports = sequelize;
