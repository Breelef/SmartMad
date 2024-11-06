// node sync.js

/* 
Manually create user with user_id 1:

INSERT INTO users (username, password, createdAt, updatedAt) 
VALUES ('user_12345', 'password_67890', NOW(), NOW());

*/

import sequelize from './database.js';
import User from '../models/user.js';
import Recipe from '../models/recipe.js';
import Ingredient from '../models/ingredient.js';
import Instruction from '../models/instruction.js';

sequelize.sync({ force: true }) // Set force: true to drop and recreate tables
    .then(() => {
        console.log('Database and tables created!');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });