import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();


const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  dialect: 'mysql',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false, // Optional: Disable logging to reduce console noise
});

export default sequelize;


