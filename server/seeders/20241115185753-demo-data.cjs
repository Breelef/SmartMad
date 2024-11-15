const faker = require('@faker-js/faker');


module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create fake Users
    const users = [...Array(5)].map(() => ({
      name: faker.faker.person.fullName(),
      email: faker.faker.internet.email(),
      password: faker.faker.internet.password(),
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert Users
    await queryInterface.bulkInsert('Users', users, {});

    // Create fake Ingredients
    const ingredients = [...Array(10)].map(() => ({
      name: faker.faker.commerce.productName(),
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert Ingredients
    await queryInterface.bulkInsert('Ingredients', ingredients, {});

    // Create fake UserPrompts
    const userPrompts = users.slice(0, 5).map((user) => ({
      user_id: user.id,
      prompt: { text: faker.faker.lorem.sentence() },
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert UserPrompts
    await queryInterface.bulkInsert('UserPrompts', userPrompts, {});

    // Create fake AIResponses
    const aiResponses = userPrompts.slice(0, 5).map((userPrompt) => ({
      user_prompt_id: userPrompt.id,
      response: { text: faker.faker.lorem.paragraph() },
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert AIResponses
    await queryInterface.bulkInsert('AIResponses', aiResponses, {});

    // Create fake Recipes
    const recipes = aiResponses.slice(0, 5).map((aiResponse) => ({
      ai_response_id: aiResponse.id,
      name: faker.faker.commerce.productName(),
      prep: faker.faker.number.int({ min: 5, max: 30 }),
      cook: faker.faker.number.int({ min: 5, max: 30 }),
      portion_size: faker.faker.number.int({ min: 2, max: 8 }),
      final_comment: faker.faker.lorem.paragraph(),
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert Recipes
    await queryInterface.bulkInsert('Recipes', recipes, {});

    // Create fake Instructions
    const instructions = recipes.slice(0, 5).map((recipe) => ({
      recipe_id: recipe.id,
      part: 'Step 1',
      steps: { description: faker.faker.lorem.sentence() },
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert Instructions
    await queryInterface.bulkInsert('Instructions', instructions, {});

    // Create fake RecipeIngredients (pivot table)
    const recipeIngredients = [...Array(10)].map(() => {
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
    });

    // Insert RecipeIngredients
    await queryInterface.bulkInsert('RecipeIngredients', recipeIngredients, {});

    // Create fake RecipeModifications
    const recipeModifications = recipes.slice(0, 5).map((recipe, index) => ({
      recipe_id: recipe.id,
      user_prompt_id: userPrompts[index].id,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert RecipeModifications
    await queryInterface.bulkInsert('RecipeModifications', recipeModifications, {});

    // Create fake ModificationResponses
    const modificationResponses = aiResponses.slice(0, 5).map((aiResponse, index) => ({
      ai_response_id: aiResponse.id,
      modification_id: recipeModifications[index].id,
      applied_to_recipe: true,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insert ModificationResponses
    await queryInterface.bulkInsert('ModificationResponses', modificationResponses, {});
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
