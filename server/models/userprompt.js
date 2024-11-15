'use strict';
import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class UserPrompt extends Model {
    static associate(models) {
      UserPrompt.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      UserPrompt.hasOne(models.AIResponse, { foreignKey: 'user_prompt_id', as: 'aiResponse' });
      UserPrompt.hasMany(models.RecipeModification, { foreignKey: 'user_prompt_id', as: 'modifications' });
    }
  }

  UserPrompt.init({
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    prompt: { type: DataTypes.JSON, allowNull: false },
  }, {
    sequelize,
    modelName: 'UserPrompt',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });


  return UserPrompt;
};
