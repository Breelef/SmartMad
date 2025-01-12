import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

describe('Recipe-Related Models Integration Tests', () => {
  let connection;

  beforeAll(async () => {
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "smartrecipe_test",
      port: 3307
    });
  });

  afterAll(async () => {
    await connection.end();
  });

  // Full Recipe Creation with All Related Entities
  test('should create a complete recipe with ingredients and instructions', async () => {
    // Create user
    const email = `recipe-user-${uuidv4()}@example.com`;
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      ['Recipe Creator', email]
    );
    const userId = userResult.insertId;

    // Create user prompt
    const promptData = { query: 'Create a recipe' };
    const [promptResult] = await connection.execute(
      'INSERT INTO userPrompts (userId, prompt, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userId, JSON.stringify(promptData)]
    );
    const userPromptId = promptResult.insertId;

    // Create AI response
    const [aiResponseResult] = await connection.execute(
      'INSERT INTO aiResponses (userPromptId, response, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userPromptId, JSON.stringify({ result: 'Recipe generated' })]
    );
    const aiResponseId = aiResponseResult.insertId;

    // Create Ingredients
    const ingredientNames = [`Ingredient-${uuidv4()}`, `Ingredient-${uuidv4()}`];
    const ingredientIds = [];
    for (const name of ingredientNames) {
      const [ingredientResult] = await connection.execute(
        'INSERT INTO ingredients (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())',
        [name]
      );
      ingredientIds.push(ingredientResult.insertId);
    }

    // Create Recipe
    const [recipeResult] = await connection.execute(
      'INSERT INTO recipes (aiResponseId, name, prep, cook, portionSize, finalComment, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [
        aiResponseId,
        'Test Recipe',
        JSON.stringify({ time: '10 mins' }),
        JSON.stringify({ time: '20 mins' }),
        4,
        'Delicious test recipe'
      ]
    );
    const recipeId = recipeResult.insertId;

    // Create Recipe Ingredients
    for (const ingredientId of ingredientIds) {
      await connection.execute(
        'INSERT INTO recipeIngredients (recipeId, ingredientId, value, unit, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
        [recipeId, ingredientId, 2.5, 'cups']
      );
    }

    // Create Instructions
    const instructionSteps = [
      { steps: ['Prepare ingredients', 'Mix thoroughly'] },
      { steps: ['Cook on medium heat', 'Serve hot'] }
    ];
    for (let i = 0; i < instructionSteps.length; i++) {
      await connection.execute(
        'INSERT INTO instructions (recipeId, part, steps, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
        [recipeId, i + 1, JSON.stringify(instructionSteps[i])]
      );
    }

    // Verify Recipe
    const [recipes] = await connection.execute('SELECT * FROM recipes WHERE id = ?', [recipeId]);
    expect(recipes[0]).toBeDefined();
    expect(recipes[0].name).toBe('Test Recipe');

    // Verify Recipe Ingredients
    const [recipeIngredients] = await connection.execute(
      'SELECT * FROM recipeIngredients WHERE recipeId = ?',
      [recipeId]
    );
    expect(recipeIngredients.length).toBe(2);

    // Verify Instructions
    const [instructions] = await connection.execute(
      'SELECT * FROM instructions WHERE recipeId = ?',
      [recipeId]
    );
    expect(instructions.length).toBe(2);
  });

  // Unique Ingredient Name Constraint Test
  test('should enforce unique ingredient name constraint', async () => {
    const uniqueName = `Ingredient-${uuidv4()}`;

    // First ingredient creation should succeed
    await connection.execute(
      'INSERT INTO ingredients (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())',
      [uniqueName]
    );

    // Second ingredient creation with same name should fail
    await expect(connection.execute(
      'INSERT INTO ingredients (name, createdAt, updatedAt) VALUES (?, NOW(), NOW())',
      [uniqueName]
    )).rejects.toThrow();
  });
});