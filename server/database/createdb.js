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
    multipleStatements: true
});


const sqlCommands = `
    -- Create the database if it doesn't exist
    CREATE DATABASE IF NOT EXISTS smartrecipe;

    USE smartrecipe;
    
    -- Drop the admin user if it already exists (optional, if you're sure you want to recreate it)
    DROP USER IF EXISTS 'admin'@'localhost';
    
    -- Create the admin user with a password
    CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin_password';
    
    -- Grant all privileges on the smartrecipe database to the admin user
    GRANT ALL PRIVILEGES ON smartrecipe.* TO 'admin'@'localhost';
    
    -- Create the customer user (you can set limited privileges if needed)
    CREATE USER IF NOT EXISTS 'customer'@'localhost' IDENTIFIED BY 'customer_password';
    
    -- Apply the changes by flushing privileges
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