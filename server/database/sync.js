// node sync.js

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