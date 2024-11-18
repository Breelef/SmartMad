'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recipe_modifications', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      recipe_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'recipes', key: 'id' }, onDelete: 'CASCADE' },
      user_prompt_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'user_prompts', key: 'id' }, onDelete: 'CASCADE' },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('recipe_modifications');
  }
};
