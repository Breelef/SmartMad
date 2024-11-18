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

const sqlCommands = `
    CREATE DATABASE IF NOT EXISTS smartrecipe;
    USE smartrecipe;
    
    -- Create SQL user 'admin' with full privileges
    CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin_password';
    GRANT ALL PRIVILEGES ON smartrecipe.* TO 'admin'@'localhost';
    
    -- Create SQL user 'customer' with limited privileges
    CREATE USER IF NOT EXISTS 'customer'@'localhost' IDENTIFIED BY 'customer_password';

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