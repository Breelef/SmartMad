const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert fake Users
    await queryInterface.bulkInsert(
      'users',
      [...Array(5)].map(() => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted Users with their IDs
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake Ingredients
    await queryInterface.bulkInsert(
      'ingredients',
      [...Array(10)].map(() => ({
        name: faker.commerce.productName(),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted Ingredients with their IDs
    const ingredients = await queryInterface.sequelize.query(
      `SELECT id FROM ingredients;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake UserPrompts
    await queryInterface.bulkInsert(
      'user_prompts',
      users.map((user) => ({
        user_id: user.id,
        prompt: JSON.stringify({
          data: {
            ingredients: [
              faker.commerce.productName(),
              faker.commerce.productName(),
              faker.commerce.productName(),
            ],
            willing_to_shop: faker.datatype.boolean(),
            comments: faker.lorem.sentence(),
            dietary_restrictions: [],
            cooking_time: faker.helpers.arrayElement(['any', 'short', 'medium', 'long']),
          },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted UserPrompts with their IDs
    const userPrompts = await queryInterface.sequelize.query(
      `SELECT id FROM user_prompts;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake ai_responses
    await queryInterface.bulkInsert(
      'ai_responses',
      userPrompts.map((userPrompt) => ({
        user_prompt_id: userPrompt.id,
        response: JSON.stringify({
          data: {
            recipe_id: 0,
            name: '',
            time: {
              prep: {
                value: 0,
                unit: 'minutes',
              },
              cook: {
                value: 0,
                unit: 'minutes',
              },
              total: {
                value: 0,
                unit: 'minutes',
              },
            },
            portions: 0,
            ingredients: [
              {
                name: '',
                value: 0,
                unit: '',
                comment: null,
              },
            ],
            instructions: [
              {
                part: '',
                steps: [''],
              },
            ],
            final_comment: '',
          },
        }),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted ai_responses with their IDs
    const aiResponses = await queryInterface.sequelize.query(
      `SELECT id FROM ai_responses;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake Recipes
    await queryInterface.bulkInsert(
      'recipes',
      aiResponses.map((aiResponse) => ({
        ai_response_id: aiResponse.id,
        name: faker.commerce.productName(),
        prep: faker.number.int({ min: 5, max: 30 }),
        cook: faker.number.int({ min: 5, max: 30 }),
        portion_size: faker.number.int({ min: 2, max: 8 }),
        final_comment: faker.lorem.paragraph(),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted Recipes with their IDs
    const recipes = await queryInterface.sequelize.query(
      `SELECT id FROM recipes;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake Instructions
    await queryInterface.bulkInsert(
      'instructions',
      recipes.map((recipe) => ({
        recipe_id: recipe.id,
        part: faker.number.int({ min: 5, max: 30 }),
        steps: JSON.stringify({ text: faker.lorem.sentence() }),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Insert fake RecipeIngredients (pivot table)
    await queryInterface.bulkInsert(
      'recipe_ingredients',
      [...Array(10)].map(() => {
        const recipe = recipes[faker.number.int({ min: 0, max: recipes.length - 1 })];
        const ingredient = ingredients[faker.number.int({ min: 0, max: ingredients.length - 1 })];
        return {
          recipe_id: recipe.id,
          ingredient_id: ingredient.id,
          value: faker.number.int({ min: 1, max: 100 }),
          unit: 'g',
          comment: faker.lorem.sentence(),
          created_at: new Date(),
          updated_at: new Date(),
        };
      }),
      {}
    );

    // Insert fake RecipeModifications
    await queryInterface.bulkInsert(
      'recipe_modifications',
      recipes.map((recipe, index) => ({
        recipe_id: recipe.id,
        user_prompt_id: userPrompts[index % userPrompts.length].id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted RecipeModifications with their IDs
    const recipeModifications = await queryInterface.sequelize.query(
      `SELECT id FROM recipe_modifications;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake ModificationResponses
    await queryInterface.bulkInsert(
      'modification_responses',
      aiResponses.map((aiResponse, index) => ({
        ai_response_id: aiResponse.id,
        modification_id: recipeModifications[index % recipeModifications.length].id,
        applied_to_recipe: true,
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback all data insertions
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('ingredients', null, {});
    await queryInterface.bulkDelete('user_prompts', null, {});
    await queryInterface.bulkDelete('ai_responses', null, {});
    await queryInterface.bulkDelete('recipes', null, {});
    await queryInterface.bulkDelete('instructions', null, {});
    await queryInterface.bulkDelete('recipe_ingredients', null, {});
    await queryInterface.bulkDelete('recipe_modifications', null, {});
    await queryInterface.bulkDelete('modification_responses', null, {});
  },
};
