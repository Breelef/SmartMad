// models/Ingredient.js
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Recipe from "./recipe.js";

const Ingredient = sequelize.define("Ingredient", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Define foreign key relationship
Ingredient.belongsTo(Recipe, { foreignKey: "recipe_id", onDelete: "CASCADE" });

export default Ingredient;
