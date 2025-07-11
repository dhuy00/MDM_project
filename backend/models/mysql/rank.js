const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Rank = sequelize.define(
  "Rank",
  {
    rank_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rank_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    min_total_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    min_order_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    benefits: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "ranks",
    timestamps: false,
  }
);

module.exports = Rank;
