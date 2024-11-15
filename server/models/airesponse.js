'use strict';
import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class AIResponse extends Model {
    static associate(models) {
      AIResponse.belongsTo(models.UserPrompt, { foreignKey: 'user_prompt_id', as: 'userPrompt' });
      AIResponse.hasMany(models.Recipe, { foreignKey: 'ai_response_id', as: 'recipe' });
      AIResponse.hasMany(models.ModificationResponse, { foreignKey: 'ai_response_id', as: 'modResponses' });
    }
  }

  AIResponse.init({
    user_prompt_id: { type: DataTypes.INTEGER, allowNull: false },
    response: { type: DataTypes.JSON, allowNull: false },
  }, {
    sequelize,
    modelName: 'AIResponse',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  return AIResponse;
};
