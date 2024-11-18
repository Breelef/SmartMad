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
// SQL statements to drop the created items
const dropFunctionsAndProceduresSQL = `
  -- Drop the function
  DROP FUNCTION IF EXISTS total_time;

  -- Drop the procedure
  DROP PROCEDURE IF EXISTS get_recipe_by_id;
`;

const dropTriggersSQL = `
  -- Drop the trigger
  DROP TRIGGER IF EXISTS before_recipe_update;
`;

const dropViewsSQL = `
  -- Drop the view
  DROP VIEW IF EXISTS recipe_times;
`;

const dropEventsSQL = `
  -- Drop the event
  DROP EVENT IF EXISTS delete_old_deleted_recipes;
`;

const clearDatabase = async () => {
  try {
    // Establish connection
    connection.connect();

    // Drop functions and procedures
    connection.query(dropFunctionsAndProceduresSQL, (err, results) => {
      if (err) {
        console.error('Error dropping functions and procedures:', err);
        return;
      }
      console.log('Functions and procedures dropped successfully.');
    });

    // Drop triggers
    connection.query(dropTriggersSQL, (err, results) => {
      if (err) {
        console.error('Error dropping triggers:', err);
        return;
      }
      console.log('Triggers dropped successfully.');
    });

    // Drop views
    connection.query(dropViewsSQL, (err, results) => {
      if (err) {
        console.error('Error dropping views:', err);
        return;
      }
      console.log('Views dropped successfully.');
    });

    // Drop events
    connection.query(dropEventsSQL, (err, results) => {
      if (err) {
        console.error('Error dropping events:', err);
        return;
      }
      console.log('Events dropped successfully.');
    });

    // Close connection
    connection.end();
  } catch (err) {
    console.error('Error during the clearing process:', err);
    connection.end();
  }
};

// Run the function
clearDatabase();
