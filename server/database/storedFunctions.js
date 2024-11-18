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

const functionsAndProceduresSQL = `
  -- Function to calculate total time (prep + cook)
  CREATE FUNCTION total_time(prep INT, cook INT) 
  RETURNS INT
  DETERMINISTIC
  BEGIN
      RETURN prep + cook;
  END;

  -- Stored procedure to get a recipe by ID
  CREATE PROCEDURE get_recipe_by_id(IN recipe_id INT)
  BEGIN
      SELECT * FROM Recipes WHERE id = recipe_id;
  END;
`;

const triggersSQL = `
  -- Trigger to automatically update the timestamp on record update
  CREATE TRIGGER before_recipe_update
  BEFORE UPDATE ON Recipes
  FOR EACH ROW
  BEGIN
      SET NEW.updated_at = NOW();
  END;
`;

const viewsSQL = `
  CREATE VIEW recipe_times AS
  SELECT id, name, total_time(prep, cook) AS total_recipe_time FROM Recipes;
`;

const eventsSQL = `
  CREATE EVENT IF NOT EXISTS delete_old_deleted_recipes
  ON SCHEDULE EVERY 1 DAY
  DO
    DELETE FROM Recipes
    WHERE deleted_at IS NOT NULL
      AND deleted_at < NOW() - INTERVAL 1 YEAR;
`;

const populateDatabase = async () => {
  try {
    // Establish connection
    connection.connect();

    // Execute SQL statements to create functions, triggers, views, etc.
    connection.query(functionsAndProceduresSQL, (err, results) => {
      if (err) {
        console.error('Error creating functions and procedures:', err);
        return;
      }
      console.log('Functions and procedures created successfully.');
    });

    connection.query(triggersSQL, (err, results) => {
      if (err) {
        console.error('Error creating triggers:', err);
        return;
      }
      console.log('Triggers created successfully.');
    });

    connection.query(viewsSQL, (err, results) => {
      if (err) {
        console.error('Error creating views:', err);
        return;
      }
      console.log('Views created successfully.');
    });

    connection.query(eventsSQL, (err, results) => {
      if (err) {
        console.error('Error creating events:', err);
        return;
      }
      console.log('Events created successfully.');
    });

    // Close connection
    connection.end();
  } catch (err) {
    console.error('Error during the population process:', err);
    connection.end();
  }
};

// Run the function
populateDatabase();