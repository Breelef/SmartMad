'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AIResponses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_prompt_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'UserPrompts', key: 'id' }, onDelete: 'CASCADE' },
      response: { type: Sequelize.JSON, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      deleted_at: { type: Sequelize.DATE },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('AIResponses');
  }
};
