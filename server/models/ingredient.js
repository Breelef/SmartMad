'use strict';
import { Model } from "sequelize";

module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    static associate(models) {
      Ingredient.hasMany(models.RecipeIngredient, { foreignKey: 'ingredient_id', as: 'recipe_ingredients' });
      Ingredient.belongsToMany(models.Recipe, {
        through: models.RecipeIngredient, // Use the RecipeIngredient model here
        foreignKey: 'ingredient_id',
        as: 'recipes'
      });
    }
  }

  Ingredient.init({
    name: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'Ingredient',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  return Ingredient;
};
