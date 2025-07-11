const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const User = require("./user");

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [
          [
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "refunded",
          ],
        ],
      },
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2), // Increased from (10,2) to handle larger amounts
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    shipping_fee: {
      type: DataTypes.DECIMAL(12, 2), // Increased to handle larger shipping fees
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shipping_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "standard",
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coupon_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [
          [
            "credit_card",
            "debit_card",
            "paypal",
            "bank_transfer",
            "cash_on_delivery",
            "shopee_pay",
          ],
        ],
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Order;
