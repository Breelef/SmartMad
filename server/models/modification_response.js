'use strict';
import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class ModificationResponse extends Model {
    static associate(models) {
      ModificationResponse.belongsTo(models.AIResponse, { foreignKey: 'ai_response_id', as: 'aiResponse' });
      ModificationResponse.belongsTo(models.RecipeModification, { foreignKey: 'modification_id', as: 'modification' });
    }
  }

  ModificationResponse.init({
    ai_response_id: {type: DataTypes.INTEGER, allowNull: false},
    modification_id: {type: DataTypes.INTEGER, allowNull: false},
    applied_to_recipe: {type: DataTypes.BOOLEAN, allowNull: false},w
  }, {
  sequelize,
  modelName: 'ModificationResponse',
  timestamps: true,
  paranoid: true,
  underscored: true,
  });
  return ModificationResponse;
}
