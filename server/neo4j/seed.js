import dotenv from 'dotenv';
import graphService from './graphService.js';
import { faker } from '@faker-js/faker';

dotenv.config();

const seedGraphDatabase = async () => {
  try {
    console.log('Clearing existing data...');
    await graphService.executeQuery('MATCH (n) DETACH DELETE n');

    // Seed Users
    console.log('Seeding Users...');
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = await graphService.createNode('User', {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      users.push(user);
    }

    // Seed UserPrompts
    console.log('Seeding UserPrompts...');
    const userPrompts = [];
    for (const user of users) {
      const userPrompt = await graphService.createNode('UserPrompt', {
        prompt: JSON.stringify({
          data: {
            ingredients: [
              faker.commerce.productName(),
              faker.commerce.productName(),
              faker.commerce.productName(),
            ],
            willingToShop: faker.datatype.boolean(),
            comments: faker.lorem.sentence(),
            dietaryRestrictions: [],
            cookingTime: faker.helpers.arrayElement(['any', 'short', 'medium', 'long']),
          },
        }),
        createdAt: new Date().toISOString(),
      });

      await graphService.createRelationship(
        { label: 'User', key: 'email', value: user.email },
        { label: 'UserPrompt', key: 'prompt', value: userPrompt.prompt },
        'CREATED_BY'
      );
      userPrompts.push(userPrompt);
    }

    // Seed AIResponses
    console.log('Seeding AIResponses...');
    const aiResponses = [];
    for (const prompt of userPrompts) {
      const aiResponse = await graphService.createNode('AIResponse', {
        response: JSON.stringify({
          data: {
            recipeId: faker.number.int({ min: 1, max: 1000 }),
            name: faker.commerce.productName(),
            time: {
              prep: { value: faker.number.int({ min: 5, max: 30 }), unit: 'minutes' },
              cook: { value: faker.number.int({ min: 10, max: 60 }), unit: 'minutes' },
              total: { value: faker.number.int({ min: 15, max: 90 }), unit: 'minutes' },
            },
            portions: faker.number.int({ min: 1, max: 8 }),
            ingredients: [
              {
                name: faker.commerce.productName(),
                value: faker.number.int({ min: 1, max: 500 }),
                unit: faker.helpers.arrayElement(['g', 'ml', 'tbsp', 'tsp', 'cup']),
                comment: faker.lorem.sentence(),
              },
            ],
            instructions: [
              {
                part: faker.lorem.words(2),
                steps: [faker.lorem.sentence(), faker.lorem.sentence()],
              },
            ],
            finalComment: faker.lorem.sentence(),
          },
        }),
        createdAt: new Date().toISOString(),
      });

      await graphService.createRelationship(
        { label: 'UserPrompt', key: 'prompt', value: prompt.prompt },
        { label: 'AIResponse', key: 'response', value: aiResponse.response },
        'GENERATED_FROM'
      );

      aiResponses.push(aiResponse);
    }

    // Seed Recipes
    console.log('Seeding Recipes...');
    const recipes = [];
    for (const response of aiResponses) {
      const recipe = await graphService.createNode('Recipe', {
        name: faker.commerce.productName(),
        prep: faker.number.int({ min: 5, max: 60 }),
        cook: faker.number.int({ min: 5, max: 120 }),
        portion_size: faker.number.int({ min: 1, max: 6 }),
        final_comment: faker.lorem.sentence(),
        createdAt: new Date().toISOString(),
      });

      await graphService.createRelationship(
        { label: 'AIResponse', key: 'response', value: response.response },
        { label: 'Recipe', key: 'name', value: recipe.name },
        'BASED_ON_RESPONSE'
      );

      recipes.push(recipe);
    }

    // Seed Ingredients
    console.log('Seeding Ingredients...');
    const ingredients = [];
    for (let i = 0; i < 10; i++) {
      const ingredient = await graphService.createNode('Ingredient', {
        name: faker.commerce.productName(),
      });
      ingredients.push(ingredient);
    }

    // Seed RecipeIngredients
    console.log('Seeding RecipeIngredients...');
    for (let i = 0; i < 10; i++) {
      const recipeIngredient = {
        recipe_name: recipes[faker.number.int({ min: 0, max: recipes.length - 1 })].name,
        ingredient_name: ingredients[faker.number.int({ min: 0, max: ingredients.length - 1 })].name,
      };
      await graphService.createRelationship(
        { label: 'Recipe', key: 'name', value: recipeIngredient.recipe_name },
        { label: 'Ingredient', key: 'name', value: recipeIngredient.ingredient_name },
        'HAS_INGREDIENT'
      );
    }

    // Seed Instructions
    console.log('Seeding Instructions...');
    for (const recipe of recipes) {
      await graphService.createNode('Instruction', {
        part: faker.lorem.words(),
        steps: Array.from({ length: 3 }).map(() => faker.lorem.sentence()),
        createdAt: new Date().toISOString(),
      });

      await graphService.createRelationship(
        { label: 'Recipe', key: 'name', value: recipe.name },
        { label: 'Instruction', key: 'part', value: recipe.name }, // Link by part name (or could be another identifier)
        'HAS_INSTRUCTION'
      );
    }

    // Seed Modifications
    console.log('Seeding Modifications...');
    for (const response of aiResponses) {
      await graphService.createNode('ModificationResponse', {
        applied_to_recipe: true,
        createdAt: new Date().toISOString(),
      });

      await graphService.createRelationship(
        { label: 'AIResponse', key: 'response', value: response.response },
        { label: 'ModificationResponse', key: 'applied_to_recipe', value: true },
        'MODIFIED_RESPONSE'
      );
    }

    console.log('All Neo4j data seeded successfully.');
  } catch (error) {
    console.error('Error seeding graph database:', error);
  }
};

try {
  console.log('Starting seeding...');
  await seedGraphDatabase();
} finally {
  await graphService.close();
}

