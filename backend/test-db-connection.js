// Test database connection and environment variables
require("dotenv").config();

console.log("🔍 Environment Variables Check:");
console.log("MYSQL_HOST:", process.env.MYSQL_HOST);
console.log("MYSQL_PORT:", process.env.MYSQL_PORT);
console.log("MYSQL_DATABASE:", process.env.MYSQL_DATABASE);
console.log("MYSQL_USERNAME:", process.env.MYSQL_USERNAME);
console.log(
  "MYSQL_PASSWORD:",
  process.env.MYSQL_PASSWORD ? "✅ Set" : "❌ Not set"
);
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Not set");

console.log("\n🔧 Testing Database Connection...");

const sequelize = require("./config/database");

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connection has been established successfully.");

    // Test MongoDB connection
    const mongoose = require("mongoose");
    const connectMongoDB = require("./config/mongodb");

    await connectMongoDB();
    console.log("✅ MongoDB connection has been established successfully.");

    console.log("\n🎉 All database connections are working!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    if (error.message.includes("Access denied")) {
      console.log(
        "\n💡 Solution: Check your MySQL credentials in the .env file"
      );
      console.log(
        "Make sure your MySQL server is running and the password is correct"
      );
    }

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Solution: Make sure your database servers are running");
      console.log("- Start MySQL server");
      console.log("- Start MongoDB server");
    }
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testConnection();
