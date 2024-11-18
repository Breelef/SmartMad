'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recipes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      ai_response_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'ai_responses', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      prep: { type: Sequelize.INTEGER, allowNull: false },
      cook: { type: Sequelize.INTEGER, allowNull: false },
      portion_size: { type: Sequelize.INTEGER, allowNull: false },
      final_comment: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('recipes');
  }
};
