const sequelize = require("../../config/database");

// Import all models
const Rank = require("./rank");
const User = require("./user");
const Shop = require("./shop");
const Order = require("./order");
const OrderDetail = require("./orderDetail");

// Define all associations here to avoid circular dependencies
const defineAssociations = () => {
  // User and Rank associations
  User.belongsTo(Rank, { foreignKey: "rank_id", as: "rank" });
  Rank.hasMany(User, { foreignKey: "rank_id", as: "users" });

  // User and Shop associations
  Shop.belongsTo(User, { foreignKey: "user_id", as: "User" });
  User.hasOne(Shop, { foreignKey: "user_id", as: "Shop" });

  // User and Order associations
  Order.belongsTo(User, { foreignKey: "user_id", as: "customer" });
  User.hasMany(Order, { foreignKey: "user_id", as: "orders" });

  // Order and OrderDetail associations
  OrderDetail.belongsTo(Order, { foreignKey: "order_id", as: "order" });
  Order.hasMany(OrderDetail, { foreignKey: "order_id", as: "orderDetails" });
};

// Initialize associations
defineAssociations();

// Sync database (only for development)
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connection has been established successfully.");

    // Force sync will drop and recreate tables (use with caution)
    // await sequelize.sync({ force: true });

    // Alter sync will update table structure without dropping data
    await sequelize.sync({ alter: true });

    console.log("All MySQL models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to MySQL database:", error);
  }
};

module.exports = {
  sequelize,
  Rank,
  User,
  Shop,
  Order,
  OrderDetail,
  syncDatabase,
};
