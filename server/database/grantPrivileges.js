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

const sqlCommands = `
    USE smartrecipe;
    
    GRANT SELECT, INSERT, UPDATE ON smartrecipe.users TO 'customer'@'localhost';
    GRANT SELECT, INSERT, UPDATE ON smartrecipe.userPrompts TO 'customer'@'localhost';


    -- Apply privilege changes
    FLUSH PRIVILEGES;
`;

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  connection.query(sqlCommands, (err, results) => {
    if (err) {
      console.error('Error executing SQL commands:', err);
    } else {
      console.log('Database and users created successfully.');
    }

    connection.end();
  });
});