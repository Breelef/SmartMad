import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

describe('UserPrompt Model Integration Tests', () => {
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

  // Create UserPrompt with User Relation
  test('should create a user prompt with associated user', async () => {
    // First, create a user
    const email = `user-${uuidv4()}@example.com`;
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      ['Test User', email]
    );
    const userId = userResult.insertId;

    // Create user prompt
    const promptData = { query: 'Test prompt', context: 'Integration test' };
    const promptDataString = JSON.stringify(promptData);
    const [promptResult] = await connection.execute(
      'INSERT INTO userPrompts (userId, prompt, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userId, promptDataString]
    );
    const promptId = promptResult.insertId;

    // Verify user prompt
    const [prompts] = await connection.execute('SELECT * FROM userPrompts WHERE id = ?', [promptId]);

    expect(prompts[0]).toBeDefined();
    expect(JSON.stringify(prompts[0].prompt)).toBe(promptDataString);
    expect(prompts[0].userId).toBe(userId);
  });

  // Optional AIResponse Relation Test
  test('should support optional AI response relation', async () => {
    // Create user
    const email = `user-${uuidv4()}@example.com`;
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      ['AI Response User', email]
    );
    const userId = userResult.insertId;

    // Create user prompt
    const promptData = { query: 'Test prompt with optional AI response' };
    const [promptResult] = await connection.execute(
      'INSERT INTO userPrompts (userId, prompt, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userId, JSON.stringify(promptData)]
    );
    const promptId = promptResult.insertId;

    // Create AI response
    const [aiResponseResult] = await connection.execute(
      'INSERT INTO aiResponses (userPromptId, response, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [promptId, JSON.stringify({ response: 'Test AI response' })]
    );
    const aiResponseId = aiResponseResult.insertId;

    // Update user prompt with AI response ID
    await connection.execute(
      'UPDATE userPrompts SET aiResponseId = ? WHERE id = ?',
      [aiResponseId, promptId]
    );

    // Verify relationships
    const [prompts] = await connection.execute('SELECT * FROM userPrompts WHERE id = ?', [promptId]);

    expect(prompts[0]).toBeDefined();
    expect(prompts[0].aiResponseId).toBe(aiResponseId);
  });

  // Soft Delete Test
  test('should support soft delete', async () => {
    // Create user
    const email = `user-${uuidv4()}@example.com`;
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      ['Soft Delete User', email]
    );
    const userId = userResult.insertId;

    // Create user prompt
    const promptData = { query: 'Soft delete test' };
    const [promptResult] = await connection.execute(
      'INSERT INTO userPrompts (userId, prompt, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userId, JSON.stringify(promptData)]
    );
    const promptId = promptResult.insertId;

    // Perform soft delete
    await connection.execute(
      'UPDATE userPrompts SET deletedAt = NOW() WHERE id = ?',
      [promptId]
    );

    // Verify soft delete
    const [prompts] = await connection.execute('SELECT * FROM userPrompts WHERE id = ?', [promptId]);

    expect(prompts[0]).toBeDefined();
    expect(prompts[0].deletedAt).not.toBeNull();
  });
});