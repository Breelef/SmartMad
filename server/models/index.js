'use strict';

import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import * as process from "process";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

// Read database configuration from environment variables
const config = {
  username: process.env[`DB_USERNAME_${env.toUpperCase()}`] || process.env.DB_USERNAME,
  password: process.env[`DB_PASSWORD_${env.toUpperCase()}`] || process.env.DB_PASSWORD,
  database: process.env[`DB_DATABASE_${env.toUpperCase()}`] || process.env.DB_DATABASE,
  host: process.env[`DB_HOST_${env.toUpperCase()}`] || process.env.DB_HOST,
  dialect: process.env[`DB_DIALECT_${env.toUpperCase()}`] || process.env.DB_DIALECT,
};

let sequelize;
if (process.env[config.use_env_variable]) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
