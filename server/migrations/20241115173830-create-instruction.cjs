'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('instructions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      recipe_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'recipes', key: 'id' }, onDelete: 'CASCADE' },
      part: { type: Sequelize.INTEGER, allowNull: false },
      steps: { type: Sequelize.JSON, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('instructions');
  }
};
