import mysql from "mysql2";
import dotenv from 'dotenv';

// Load environment variables from .env file
//Hvis bare filen skal køres
//dotenv.config({ path: "../.env"});

//Hvis du kører fra root directory
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
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
