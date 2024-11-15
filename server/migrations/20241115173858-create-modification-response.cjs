'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ModificationResponses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      ai_response_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'AIResponses', key: 'id' }, onDelete: 'CASCADE' },
      modification_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'RecipeModifications', key: 'id' }, onDelete: 'CASCADE' },
      timestamp: { type: Sequelize.DATE, allowNull: false },
      applied_to_recipe: { type: Sequelize.BOOLEAN, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('ModificationResponses');
  }
};
