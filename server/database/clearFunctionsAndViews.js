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
    database: config.database,
    multipleStatements: true
});
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
