'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('modification_responses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      ai_response_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'ai_responses', key: 'id' }, onDelete: 'CASCADE' },
      modification_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'recipe_modifications', key: 'id' }, onDelete: 'CASCADE' },
      applied_to_recipe: { type: Sequelize.BOOLEAN, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('modification_responses');
  }
};
