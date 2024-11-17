# Running Smartmad backend and database

## Database migrations

cd into the server folder and enter: **npm i**

Run the command: **npx sequelize-cli db:migrate**

After the migration is finished start the seeding procedure with the command: **npx sequelize-cli db:seed:all**


## Database Users

Username: **admin** Password: **admin** Privileges: ALL

Username: **customer** Password: **123**(Will be changed later based on the customers ow password) **Privileges**: SELECT, UPDATE and INSERT in the users and userprompts tables