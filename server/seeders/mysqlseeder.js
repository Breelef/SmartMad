import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hashPassword } from "../auth/authHelpers.js";

const prisma = new PrismaClient();

async function seed() {
  try {
    // Insert fake Users
    const createUsers = await prisma.user.createMany({
      data: [...Array(5)].map(() => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
    const hashedPassword = await hashPassword("admin123");
    const testUser = await prisma.user.create({
        data: {
          name: "Test User",
          email: "admin@admin.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
    });
    const users = await prisma.user.findMany();

    // Insert fake Ingredients
    const ingredientCreation = await prisma.ingredient.createMany({
      data: [...Array(10)].map(() => ({
        name: faker.commerce.productName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
    const ingredients = await prisma.ingredient.findMany();


    // Insert fake UserPrompts
    const userPromptsRecords = await prisma.userPrompt.createMany({
      data: users.map((user) => ({
        userId: user.id,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
    const userPrompts = await prisma.userPrompt.findMany();

    // Insert fake ai_responses
    const aiResponseRecords = await prisma.aIResponse.createMany({
      data: userPrompts.map((userPrompt) => ({
        userPromptId: userPrompt.id,
        response: JSON.stringify({
          data: {
            recipeId: 0,
            name: '',
            time: {
              prep: { value: 0, unit: 'minutes' },
              cook: { value: 0, unit: 'minutes' },
              total: { value: 0, unit: 'minutes' },
            },
            portions: 0,
            ingredients: [{ name: '', value: 0, unit: '', comment: null }],
            instructions: [{ part: '', steps: [''] }],
            finalComment: '',
          },
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
    const aiResponses = await prisma.aIResponse.findMany();

    const prep = {
      value: faker.number.int({ min: 5, max: 30 }),
      unit: "minutes",
    };

    const cook = {
      value: faker.number.int({ min: 5, max: 30 }),
      unit: "minutes",
    };
    // Insert fake Recipes
    const recipeCreation = await prisma.recipe.createMany({
      data: aiResponses.map((aiResponse) => ({
        aiResponseId: aiResponse.id,
        name: faker.commerce.productName(),
        prep: prep,
        cook: cook,
        portionSize: faker.number.int({ min: 2, max: 8 }),
        finalComment: faker.lorem.paragraph(2),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
    const recipes = await prisma.recipe.findMany();

    // Insert fake Instructions
    const instructions = await prisma.instruction.createMany({
      data: recipes.map((recipe, index) => ({
        recipeId: recipe.id,
        part: index + 1,
        steps: JSON.stringify({ text: faker.lorem.sentence() }),
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });

    // Insert fake RecipeIngredients (pivot table)
// Insert fake RecipeIngredients (pivot table)
const recipeIngredients = await prisma.recipeIngredient.createMany({
  data: recipes.flatMap((recipe) => {
    // Create a set to track unique combinations of recipeId and ingredientId
    const usedIngredients = new Set();

    return [...Array(5)].map(() => {
      let ingredient;
      // Ensure the ingredient is not duplicated for this recipeId
      do {
        ingredient = ingredients[faker.number.int({ min: 0, max: ingredients.length - 1 })];
      } while (usedIngredients.has(ingredient.id));

      // Add the ingredientId to the set to prevent duplication
      usedIngredients.add(ingredient.id);

      return {
        recipeId: recipe.id,
        ingredientId: ingredient.id,
        value: faker.number.int({ min: 1, max: 100 }),
        unit: faker.helpers.arrayElement(['grams', 'cups', 'pieces', 'ml']),
      };
    });
  }),
});

    // Insert fake RecipeModifications
    const recipeModificationCreate = await prisma.recipeModification.createMany({
      data: recipes.map((recipe, index) => ({
        recipeId: recipe.id,
        userPromptId: userPrompts[index % userPrompts.length].id,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });
    const recipeModifications = await prisma.recipeModification.findMany();



    // Insert fake ModificationResponses
    await prisma.modificationResponse.createMany({
      data: aiResponses.map((aiResponse, index) => ({
        aiResponseId: aiResponse.id,
        modificationId: recipeModifications[index % recipeModifications.length].id,
        appliedToRecipe: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });

    console.log("All data seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seed();
