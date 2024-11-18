import mysql from "mysql2";
import configFile from '../config/config.json' assert { type: 'json' };

// Get the environment variable
const env = process.env.NODE_ENV || 'development';

// Access the configuration for the current environment
const config = configFile[env];
const connection = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    multipleStatements: true
});

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
