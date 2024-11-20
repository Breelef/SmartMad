import mongoose from 'mongoose';
import AIResponse from './models/AIResponse.js';
import Ingredient from './models/Ingredient.js';
import Instruction from './models/Instruction.js';
import ModificationResponse from './models/ModificationResponse.js';
import RecipeIngredient from './models/RecipeIngredient.js';
import Recipe from './models/Recipe.js';
import User from './models/User.js';
import UserPrompt from './models/UserPrompt.js';
import { faker } from '@faker-js/faker';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/Smartmad');
    console.log('Connected to the database.');


    //If database wipe is needed, outcomment:
    ///*
    await Promise.all([
      User.deleteMany({}),
      UserPrompt.deleteMany({}),
      AIResponse.deleteMany({}),
      Ingredient.deleteMany({}),
      Recipe.deleteMany({}),
      RecipeIngredient.deleteMany({}),
      Instruction.deleteMany({}),
      ModificationResponse.deleteMany({}),
    ]);
    console.log('Database cleared.');
    //*/

    // Seed Users
    const users = [];
    for (let i = 0; i < 5; i++) {
      users.push(await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      }));
    }

    console.log('Users seeded:', users);

    // Seed UserPrompts
    const userPrompts = [];
    for (let i = 0; i < 5; i++) {
      const userPrompt = await UserPrompt.create({
        user_id: users[i % users.length]._id,  // Associate with random user
        prompt: {
          text: faker.lorem.sentence(),
        },
      });
      userPrompts.push(userPrompt);
    }

    console.log('UserPrompts seeded:', userPrompts);

    // Seed AIResponses
    const aiResponses = [];

for (let i = 0; i < userPrompts.length; i++) {
  // Create and save the AIResponse document
  const aiResponse = await AIResponse.create({
    user_prompt_id: userPrompts[i % userPrompts.length]._id, // Associate with random UserPrompt
    response: {
      data: {
        recipe_id: faker.number.int({ min: 5, max: 30 }),
        name: faker.commerce.productName(),
        time: {
          prep: {
            value: faker.number.int({ min: 5, max: 60 }),
            unit: 'minutes',
          },
          cook: {
            value: faker.number.int({ min: 5, max: 120 }),
            unit: 'minutes',
          },
          total: {
            value: faker.number.int({ min: 15, max: 180 }),
            unit: 'minutes',
          },
        },
        portions: faker.number.int({ min: 1, max: 6 }),
        ingredients: Array.from({ length: 3 }).map(() => ({
          name: faker.commerce.productName(),
          value: faker.number.int({ min: 1, max: 500 }),
          unit: faker.helpers.arrayElement(['g', 'ml', 'cup', 'tbsp', 'oz']),
          comment: faker.helpers.arrayElement([null, 'Optional ingredient']),
        })),
        instructions: Array.from({ length: 2 }).map(() => ({
          part: faker.lorem.words(),
          steps: Array.from({ length: 3 }).map(() => faker.lorem.sentence()),
        })),
        final_comment: faker.lorem.sentence(),
      },
    },
  });

  aiResponses.push(aiResponse); 
}

console.log('AIResponses seeded:', aiResponses);


    // Seed Ingredients
    const ingredients = [];
    for (let i = 0; i < 10; i++) {
      const ingredient = await Ingredient.create({
        name: faker.commerce.productName(),
      });
      ingredients.push(ingredient);
    }

    console.log('Ingredients seeded:', ingredients);



    // Seed Recipes
    const recipes = [];
    for (let i = 0; i < aiResponses.length; i++) {
      const random_airesponse = aiResponses[i % aiResponses.length]
      console.log(random_airesponse);
      console.log(random_airesponse.response.data.name);
      const recipe = await Recipe.create({
        ai_response_id: random_airesponse._id,  // Reference a random AIResponse
        name: random_airesponse.response.data.name,
        prep: random_airesponse.response.data.time.prep.value,
        cook: random_airesponse.response.data.time.cook.value,
        total: random_airesponse.response.data.time.total.value,
        portion_size: random_airesponse.response.data.portions,
        final_comment: random_airesponse.response.data.final_comment,
      });
      recipes.push(recipe);
    }

    console.log('Recipes seeded:', recipes);

    // Seed RecipeIngredients (pivot table)
    for (let i = 0; i < 10; i++) {
      const recipeIngredient = await RecipeIngredient.create({
        recipe_id: recipes[faker.number.int({ min: 0, max: recipes.length - 1 })]._id,
        ingredient_id: ingredients[faker.number.int({ min: 0, max: ingredients.length - 1 })]._id,
        value: faker.number.int({ min: 1, max: 100 }),
        unit: 'g',
        comment: faker.lorem.sentence(),
      });
      console.log('RecipeIngredient seeded:', recipeIngredient);
    }

    // Seed Instructions
    for (let i = 0; i < 5; i++) {
      const instruction = await Instruction.create({
        recipe_id: recipes[i % recipes.length]._id,  // Reference a random Recipe
        part: faker.number.int({ min: 1, max: 10 }),
        steps: faker.lorem.sentences(),
      });
      console.log('Instruction seeded:', instruction);
    }

    // Seed Modifications
    for (let i = 0; i < 5; i++) {
      const modification = await ModificationResponse.create({
        ai_response_id: aiResponses[i % aiResponses.length]._id,  // Reference a random AIResponse
        applied_to_recipe: true,
      });
      console.log('ModificationResponse seeded:', modification);
    }

    console.log('Database has been seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.connection.close();  // Close the connection once seeding is complete
  }
};

seedDatabase();