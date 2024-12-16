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
      const user = await graphService.executeQuery(
        `CREATE (u:User {name: $name, email: $email, password: $password}) RETURN u`,
        {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        }
      );
      users.push(user);
    }

    // Seed UserPrompts
    console.log('Seeding UserPrompts...');
    const userPrompts = [];
    for (const user of users) {
      const userPrompt = await graphService.executeQuery(
        `
        MATCH (u:User {email: $email})
        CREATE (p:UserPrompt {prompt: $prompt, createdAt: datetime()})-[:CREATED_BY]->(u) RETURN p
        `,
        {
          email: user.email,
          prompt: faker.lorem.sentence(),
        }
      );
      userPrompts.push(userPrompt);
    }

    // Seed AIResponses
    console.log('Seeding AIResponses...');
    const aiResponses = [];
    for (const prompt of userPrompts) {
      const aiResponse = await graphService.executeQuery(
        `
        MATCH (p:UserPrompt {prompt: $prompt})
        CREATE (ar:AIResponse {response: $response, createdAt: datetime()})-[:GENERATED_FROM]->(p) RETURN ar
        `,
        {
          prompt: prompt.prompt,
          response: JSON.stringify({ recipe: 'Pasta Bolognese' }),
        }
      );
      aiResponses.push(aiResponse);
    }

    // Seed Recipes
    console.log('Seeding Recipes...');
    const recipes = [];
    for (const response of aiResponses) {
      const recipe = await graphService.executeQuery(
        `
        MATCH (ar:AIResponse {response: $response})
        CREATE (r:Recipe {
          name: $name,
          prep: $prep,
          cook: $cook,
          portion_size: $portion_size,
          final_comment: $final_comment,
          createdAt: datetime()
        })-[:BASED_ON_RESPONSE]->(ar) RETURN r
        `,
        {
          name: faker.commerce.productName(),
          prep: faker.number.int({ min: 5, max: 60 }),
          cook: faker.number.int({ min: 5, max: 120 }),
          portion_size: faker.number.int({ min: 1, max: 6 }),
          final_comment: faker.lorem.sentence(),
          response: response.response,
        }
      );
      recipes.push(recipe);
    }

    // Seed Ingredients
    console.log('Seeding Ingredients...');
    const ingredients = [];
    for (let i = 0; i < 10; i++) {
      const ingredient = await graphService.createIngredient({
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
      await graphService.executeQuery(
        `
        MATCH (r:Recipe {name: $recipe_name}), (i:Ingredient {name: $ingredient_name})
        CREATE (r)-[:HAS_INGREDIENT]->(i)
        `,
        recipeIngredient
      );
    }

    // Seed Instructions
    console.log('Seeding Instructions...');
    for (const recipe of recipes) {
      await graphService.executeQuery(
        `
        MATCH (r:Recipe {name: $recipe_name})
        CREATE (instr:Instruction {part: $part, steps: $steps, createdAt: datetime()})
        CREATE (r)-[:HAS_INSTRUCTION]->(instr)
        `,
        {
          recipe_name: recipe.name,
          part: faker.lorem.words(),
          steps: Array.from({ length: 3 }).map(() => faker.lorem.sentence()),
        }
      );
    }

    // Seed Modifications
    console.log('Seeding Modifications...');
    for (const response of aiResponses) {
      await graphService.executeQuery(
        `
        MATCH (ar:AIResponse {response: $response})
        CREATE (mod:ModificationResponse {applied_to_recipe: true, createdAt: datetime()})
        CREATE (mod)-[:MODIFIED_RESPONSE]->(ar)
        `,
        {
          response: response.response,
        }
      );
    }

    console.log('All data seeded successfully.');
  } catch (error) {
    console.error('Error seeding graph database:', error);
  }
};

seedGraphDatabase();
