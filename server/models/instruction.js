'use strict';
import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Instruction extends Model {
    static associate(models) {
      Instruction.belongsTo(models.Recipe, { foreignKey: 'recipe_id', as: 'recipe' });
    }
  }

  Instruction.init({
    recipe_id: { type: DataTypes.INTEGER, allowNull: false },
    part: { type: DataTypes.STRING, allowNull: false },
    steps: { type: DataTypes.JSON, allowNull: false },
  }, {
    sequelize,
    modelName: 'Instruction',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  return Instruction;
};
