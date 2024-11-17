'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      -- Create customer user with limited privileges
      CREATE USER IF NOT EXISTS 'customer'@'localhost' IDENTIFIED BY '123';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.users TO 'customer'@'localhost';
      GRANT SELECT, INSERT, UPDATE ON smartrecipe.userprompts TO 'customer'@'localhost';

      -- Create admin user with all privileges
      CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin_password';
      GRANT ALL PRIVILEGES ON smartrecipe.* TO 'admin'@'localhost';

      -- Apply changes
      FLUSH PRIVILEGES;
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      -- Drop customer and admin users
      DROP USER IF EXISTS 'customer'@'localhost';
      DROP USER IF EXISTS 'admin'@'localhost';
    `);
  },
};
