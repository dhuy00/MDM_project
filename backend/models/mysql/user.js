const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Rank = require("./rank");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "customer",
      validate: {
        isIn: [["customer", "seller", "admin"]],
      },
    },
    rank_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Rank,
        key: "rank_id",
      },
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "active",
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
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Define associations
User.associate = (models) => {
  User.hasOne(models.Shop, {
    foreignKey: "user_id",
    as: "Shop",
  });
  User.belongsTo(models.Rank, {
    foreignKey: "rank_id",
    as: "Rank",
  });
};

module.exports = User;
