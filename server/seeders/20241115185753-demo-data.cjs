const faker = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert fake Users
    await queryInterface.bulkInsert(
      'Users',
      [...Array(5)].map(() => ({
        name: faker.faker.person.fullName(),
        email: faker.faker.internet.email(),
        password: faker.faker.internet.password(),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted Users with their IDs
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM Users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake Ingredients
    await queryInterface.bulkInsert(
      'Ingredients',
      [...Array(10)].map(() => ({
        name: faker.faker.commerce.productName(),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted Ingredients with their IDs
    const ingredients = await queryInterface.sequelize.query(
      `SELECT id FROM Ingredients;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake UserPrompts
    await queryInterface.bulkInsert(
      'UserPrompts',
      users.map((user) => ({
        user_id: user.id,
        prompt: JSON.stringify({ text: faker.faker.lorem.sentence() }),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted UserPrompts with their IDs
    const userPrompts = await queryInterface.sequelize.query(
      `SELECT id FROM UserPrompts;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake AIResponses
    await queryInterface.bulkInsert(
      'AIResponses',
      userPrompts.map((userPrompt) => ({
        user_prompt_id: userPrompt.id,
        response: JSON.stringify({ text: faker.faker.lorem.sentence() }),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted AIResponses with their IDs
    const aiResponses = await queryInterface.sequelize.query(
      `SELECT id FROM AIResponses;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake Recipes
    await queryInterface.bulkInsert(
      'Recipes',
      aiResponses.map((aiResponse) => ({
        ai_response_id: aiResponse.id,
        name: faker.faker.commerce.productName(),
        prep: faker.faker.number.int({ min: 5, max: 30 }),
        cook: faker.faker.number.int({ min: 5, max: 30 }),
        portion_size: faker.faker.number.int({ min: 2, max: 8 }),
        final_comment: faker.faker.lorem.paragraph(),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Retrieve inserted Recipes with their IDs
    const recipes = await queryInterface.sequelize.query(
      `SELECT id FROM Recipes;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake Instructions
    await queryInterface.bulkInsert(
      'Instructions',
      recipes.map((recipe) => ({
        recipe_id: recipe.id,
        part: 'Step 1',
        steps: JSON.stringify({ text: faker.faker.lorem.sentence() }),
        created_at: new Date(),
        updated_at: new Date(),
      })),
      {}
    );

    // Insert fake RecipeIngredients (pivot table)
    await queryInterface.bulkInsert(
      'recipe_ingredients',
      [...Array(10)].map(() => {
        const recipe = recipes[faker.faker.number.int({ min: 0, max: recipes.length - 1 })];
        const ingredient = ingredients[faker.faker.number.int({ min: 0, max: ingredients.length - 1 })];
        return {
          recipe_id: recipe.id,
          ingredient_id: ingredient.id,
          value: faker.faker.number.int({ min: 1, max: 100 }),
          unit: 'g',
          comment: faker.faker.lorem.sentence(),
          created_at: new Date(),
          updated_at: new Date(),
        };
      }),
      {}
    );

    // Insert fake RecipeModifications
    await queryInterface.bulkInsert(
      'RecipeModifications',
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
      `SELECT id FROM RecipeModifications;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert fake ModificationResponses
    await queryInterface.bulkInsert(
      'ModificationResponses',
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
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Ingredients', null, {});
    await queryInterface.bulkDelete('UserPrompts', null, {});
    await queryInterface.bulkDelete('AIResponses', null, {});
    await queryInterface.bulkDelete('Recipes', null, {});
    await queryInterface.bulkDelete('Instructions', null, {});
    await queryInterface.bulkDelete('RecipeIngredients', null, {});
    await queryInterface.bulkDelete('RecipeModifications', null, {});
    await queryInterface.bulkDelete('ModificationResponses', null, {});
  },
};
