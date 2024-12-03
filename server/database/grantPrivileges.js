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