const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Order = require("./order");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    order_detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: "order_id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Reference to product in MongoDB",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    variant: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "JSON string of product variant (size, color, etc.)",
      get() {
        const value = this.getDataValue("variant");
        return value ? JSON.parse(value) : null;
      },
      set(value) {
        this.setDataValue("variant", value ? JSON.stringify(value) : null);
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
    tableName: "order_details",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = OrderDetail;
