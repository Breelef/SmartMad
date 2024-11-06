// models/Instruction.js
import { DataTypes } from "sequelize";
import sequelize from "../database/database.js";
import Recipe from "./recipe.js";

const Instruction = sequelize.define("Instruction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  part: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  step: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define foreign key relationship
Instruction.belongsTo(Recipe, { foreignKey: "recipe_id", onDelete: "CASCADE" });

export default Instruction;
