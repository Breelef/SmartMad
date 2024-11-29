'use strict';
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.UserPrompt, { foreignKey: 'user_id', as: 'prompts' });
      User.belongsToMany(models.Recipe, {
        through: 'users_recipes',
        foreignKey: 'user_id',
        as: 'recipes'
      });
    }
  }

  User.init({
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true,
    paranoid: true,
    underscored: true,
  });

  return User;
};
