'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE DATABASE IF NOT EXISTS smartrecipe;
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DROP DATABASE IF EXISTS smartrecipe;
    `);
  },
};
