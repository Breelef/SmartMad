'use strict';
import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class RecipeModification extends Model {
    static associate(models) {
      RecipeModification.belongsTo(models.Recipe, { foreignKey: 'recipe_id', as: 'recipe' });
      RecipeModification.belongsTo(models.UserPrompt, { foreignKey: 'user_prompt_id', as: 'userPrompt' });
      RecipeModification.hasMany(models.ModificationResponse, { foreignKey: 'modification_id', as: 'responses' });
    }
  }

  RecipeModification.init({
    recipe_id: { type: DataTypes.INTEGER, allowNull: false },
    user_prompt_id: { type: DataTypes.INTEGER, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false },
  }, {
    sequelize,
    modelName: 'RecipeModification',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  return RecipeModification;
};
