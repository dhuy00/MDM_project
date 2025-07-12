const db = require("../db/mysql");
const bcrypt = require("bcrypt");

async function checkUsers() {
  try {
    console.log("Checking users in database...");
    
    // Get all users
    const [users] = await db.query("SELECT user_id, full_name, phone, email, role, status FROM users");
    console.log("Users found:", users);
    
    if (users.length === 0) {
      console.log("No users found. Creating a test user...");
      
      // Create a test user
      const hashedPassword = await bcrypt.hash("password123", 10);
      await db.query(
        "INSERT INTO users (full_name, password, email, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)",
        ["test_user", hashedPassword, "test@example.com", "0123456789", "customer", "active"]
      );
      
      console.log("Test user created:");
      console.log("Phone: 0123456789");
      console.log("Password: password123");
    }
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
}

checkUsers();
