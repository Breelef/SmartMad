import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);
console.log("Connected to Neo4j...");

const session = driver.session();

const seedGraphDatabase = async () => {
  try {

    await session.run('MATCH (n) DETACH DELETE n');
    

    // Seed Users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const user = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      await session.run(
        `CREATE (:User {name: $name, email: $email, password: $password})`,
        user
      );
      users.push(user);
    }
    console.log('Users seeded');

    // Seed UserPrompts
    const userPrompts = [];
    for (let i = 0; i < 5; i++) {
      const userPrompt = {
        email: users[i % users.length].email,
        prompt: faker.lorem.sentence(),
      };
      await session.run(
        `
        MATCH (u:User {email: $email})
        CREATE (p:UserPrompt {prompt: $prompt, createdAt: datetime()})-[:CREATED_BY]->(u)
        `,
        userPrompt
      );
      userPrompts.push(userPrompt);
    }
    console.log('UserPrompts seeded');

    // Seed AIResponses
    const aiResponses = [];
    for (let i = 0; i < userPrompts.length; i++) {
      const aiResponse = {
        prompt: userPrompts[i % userPrompts.length].prompt,  // Associate with a random UserPrompt
        response: '{"recipe": "Pasta Bolognese"}',
      };
      await session.run(
        `
        MATCH (p:UserPrompt {prompt: $prompt})
        CREATE (ar:AIResponse {response: $response, createdAt: datetime()})-[:GENERATED_FROM]->(p)
        `,
        aiResponse
      );
      aiResponses.push(aiResponse);
    }
    console.log('AIResponses seeded');

    // Seed Recipes
    const recipes = [];
    for (let i = 0; i < aiResponses.length; i++) {
      const recipe = {
        name: faker.commerce.productName(),
        prep: faker.number.int({ min: 5, max: 60 }),
        cook: faker.number.int({ min: 5, max: 120 }),
        portion_size: faker.number.int({ min: 1, max: 6 }),
        final_comment: faker.lorem.sentence(),
        response: aiResponses[i % aiResponses.length].response,
      };
      await session.run(
        `
        MATCH (ar:AIResponse {response: $response})
        CREATE (r:Recipe {
          name: $name,
          prep: $prep,
          cook: $cook,
          portion_size: $portion_size,
          final_comment: $final_comment,
          createdAt: datetime()
        })-[:BASED_ON_RESPONSE]->(ar)
        `,
        recipe
      );
      recipes.push(recipe);
    }
    console.log('Recipes seeded');

    // Seed Ingredients
    const ingredients = [];
    for (let i = 0; i < 10; i++) {
      const ingredient = { name: faker.commerce.productName() };
      await session.run(
        `CREATE (:Ingredient {name: $name})`,
        ingredient
      );
      ingredients.push(ingredient);
    }
    console.log('Ingredients seeded');

    // Seed RecipeIngredients (pivot table)
    for (let i = 0; i < 10; i++) {
      const recipeIngredient = {
        recipe_name: recipes[faker.number.int({ min: 0, max: recipes.length - 1 })].name,
        ingredient_name: ingredients[faker.number.int({ min: 0, max: ingredients.length - 1 })].name,
      };
      await session.run(
        `
        MATCH (r:Recipe {name: $recipe_name}), (i:Ingredient {name: $ingredient_name})
        CREATE (r)-[:HAS_INGREDIENT]->(i)
        `,
        recipeIngredient
      );
    }
    console.log('RecipeIngredient seeded');

    // Seed Instructions
    for (let i = 0; i < 5; i++) {
      const instruction = {
        recipe_name: recipes[i % recipes.length].name,
        part: faker.lorem.words(),
        steps: Array.from({ length: 3 }).map(() => faker.lorem.sentence()),
      };
      await session.run(
        `
        MATCH (r:Recipe {name: $recipe_name})
        CREATE (instr:Instruction {part: $part, steps: $steps, createdAt: datetime()})
        CREATE (r)-[:HAS_INSTRUCTION]->(instr)
        `,
        instruction
      );
    }
    console.log('Instruction seeded');

    // Seed Modifications
    for (let i = 0; i < 5; i++) {
      const modification = {
        response: aiResponses[i % aiResponses.length].response,
      };
      await session.run(
        `
        MATCH (ar:AIResponse {response: $response})
        CREATE (mod:ModificationResponse {applied_to_recipe: true, createdAt: datetime()})
        CREATE (mod)-[:MODIFIED_RESPONSE]->(ar)
        `,
        modification
      );
    }
    console.log('ModificationResponse seeded');

    console.log('All Neo4j data seeded\n\n');
  } catch (error) {
    console.error('Error seeding graph database:', error);
  } finally {
    // Ensure we close the session and the driver connection
    if (session) {
      await session.close();
    }
    if (driver) {
      await driver.close();
    }
  }
};

seedGraphDatabase();
