// models/Recipe.js
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import User from "./user.js";

const Recipe = sequelize.define("Recipe", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prep_time: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cook_time: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_time: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  portions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  final_comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define foreign key relationship
Recipe.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });

export default Recipe;
