'use strict';
import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      Recipe.belongsTo(models.AIResponse, { foreignKey: 'ai_response_id', as: 'aiResponse' });
      Recipe.hasMany(models.Instruction, { foreignKey: 'recipe_id', as: 'instructions' });
      Recipe.hasMany(models.RecipeIngredient, { foreignKey: 'recipe_id', as: 'recipeIngredients' });
      Recipe.hasMany(models.RecipeModification, { foreignKey: 'recipe_id', as: 'modifications' });
      Recipe.belongsToMany(models.User, {
        through: 'Users_Recipes',
        foreignKey: 'recipe_id',
        as: 'users'
      });
      Recipe.belongsToMany(models.Ingredient, {
        through: models.RecipeIngredient,
        foreignKey: 'recipe_id',
        as: 'ingredients'
      });
    }
  }

  Recipe.init({
    ai_response_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    prep: { type: DataTypes.INTEGER, allowNull: false },
    cook: { type: DataTypes.INTEGER, allowNull: false },
    portion_size: { type: DataTypes.INTEGER, allowNull: false },
    final_comment: { type: DataTypes.TEXT, allowNull: false },
  }, {
    sequelize,
    modelName: 'Recipe',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  return Recipe;
};
