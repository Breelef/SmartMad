import mysql from "mysql2";
import dotenv from "dotenv"
//Hvis bare filen skal køres
//dotenv.config({ path: "../.env"});

//Hvis du kører fra root directory
dotenv.config();

// Access the configuration for the current environment

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
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

  CREATE PROCEDURE get_recipe_by_id(IN recipe_id INT)
  BEGIN
      SELECT * FROM recipes WHERE id = recipe_id;
  END;
`;

const triggersSQL = `
  -- Trigger to automatically update the timestamp on record update
  CREATE TRIGGER before_recipe_update
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  BEGIN
      SET NEW.updatedAt = NOW();
  END;
`;

const viewsSQL = `
  CREATE VIEW recipe_times AS
  SELECT id, name, total_time(prep, cook) AS total_recipe_time FROM recipes;
`;

const eventsSQL = `
  CREATE EVENT IF NOT EXISTS delete_old_deleted_recipes
  ON SCHEDULE EVERY 1 DAY
  DO
    DELETE FROM recipes
    WHERE deletedAt IS NOT NULL
      AND deletedAt < NOW() - INTERVAL 1 YEAR;
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
