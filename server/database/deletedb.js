import mysql from "mysql2";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get the environment variable
const env = process.env.NODE_ENV || 'development';

// Use environment variables directly instead of config.json
const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || 'smartrecipe',
    port: process.env.DB_PORT || 3306,
    multipleStatements: true
};

// Create the MySQL connection using the config object
const connection = mysql.createConnection(config);

// Function to execute SQL commands
const executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Main function to drop the database and users
const resetDatabase = async () => {
  try {
    // Drop the users (admin and customer)
    await executeQuery("DROP USER IF EXISTS 'admin'@'localhost';");
    console.log('Dropped user "admin"');

    await executeQuery("DROP USER IF EXISTS 'customer'@'localhost';");
    console.log('Dropped user "customer"');

    // Drop the smartrecipe database
    await executeQuery('DROP DATABASE IF EXISTS smartrecipe;');
    console.log('Dropped database "smartrecipe"');

    // Close the connection
    connection.end();
  } catch (err) {
    console.error('Error during the reset process:', err);
    connection.end();
  }
};

// Call the function to reset the database
resetDatabase();
