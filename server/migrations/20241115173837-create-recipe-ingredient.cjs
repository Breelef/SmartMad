'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recipe_ingredients', {
      recipe_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'recipes', key: 'id' }, onDelete: 'CASCADE' },
      ingredient_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'ingredients', key: 'id' }, onDelete: 'CASCADE' },
      value: { type: Sequelize.INTEGER, allowNull: false },
      unit: { type: Sequelize.STRING, allowNull: false },
      comment: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('recipe_ingredients');
  }
};
