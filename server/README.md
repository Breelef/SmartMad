# Running Smartmad backend and database

## Database migrations
To create the schema, enter the following command: mysql -u root -p -e "CREATE DATABASE smartrecipe;"
cd into the server folder and enter: **npm i**
Run the command: **npx sequelize-cli db:migrate**
After the migration is finished start the seeding procedure with the command: **npx sequelize-cli db:seed:all**

NOT NEEDED: Run the schema.sql file in the database folder to create and use different database users depending on privileges.
