'use strict';
import { Model } from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class RecipeIngredient extends Model {
    static associate(models) {
      RecipeIngredient.belongsTo(models.Recipe, { foreignKey: 'recipe_id', as: 'recipe' });
      RecipeIngredient.belongsTo(models.Ingredient, { foreignKey: 'ingredient_id', as: 'ingredient' });
    }
  }

  RecipeIngredient.init({
    recipe_id: { type: DataTypes.INTEGER, allowNull: false },
    ingredient_id: { type: DataTypes.INTEGER, allowNull: false },
    value: { type: DataTypes.FLOAT, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
  }, {
    sequelize,
    modelName: 'recipeingredient',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  return RecipeIngredient;
};
