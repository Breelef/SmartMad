import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

describe('AIResponse Model Integration Tests', () => {
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

  // Create AIResponse with UserPrompt
  test('should create an AI response with associated user prompt', async () => {
    // Create user
    const email = `user-${uuidv4()}@example.com`;
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      ['Test User', email]
    );
    const userId = userResult.insertId;

    // Create user prompt
    const promptData = { query: 'Test prompt' };
    const [promptResult] = await connection.execute(
      'INSERT INTO userPrompts (userId, prompt, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userId, JSON.stringify(promptData)]
    );
    const userPromptId = promptResult.insertId;

    // Create AI response
    const responseData = { result: 'Test AI response' };
    const responseDataString = JSON.stringify(responseData);
    const [aiResponseResult] = await connection.execute(
      'INSERT INTO aiResponses (userPromptId, response, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userPromptId, JSON.stringify(responseData)]
    );
    const aiResponseId = aiResponseResult.insertId;

    // Verify AI response
    const [aiResponses] = await connection.execute('SELECT * FROM aiResponses WHERE id = ?', [aiResponseId]);

    expect(aiResponses[0]).toBeDefined();
    expect(aiResponses[0].response).toEqual(responseData);
    expect(aiResponses[0].userPromptId).toBe(userPromptId);
  });

  // Unique UserPrompt Constraint Test
  test('should enforce unique userPromptId constraint', async () => {
    // Create user
    const email = `unique-user-${uuidv4()}@example.com`;
    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      ['Unique Constraint User', email]
    );
    const userId = userResult.insertId;

    // Create user prompt
    const promptData = { query: 'Unique constraint test' };
    const [promptResult] = await connection.execute(
      'INSERT INTO userPrompts (userId, prompt, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userId, JSON.stringify(promptData)]
    );
    const userPromptId = promptResult.insertId;

    // Create first AI response
    await connection.execute(
      'INSERT INTO aiResponses (userPromptId, response, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userPromptId, JSON.stringify({ result: 'First response' })]
    );

    // Attempt to create second AI response with same userPromptId should fail
    await expect(connection.execute(
      'INSERT INTO aiResponses (userPromptId, response, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userPromptId, JSON.stringify({ result: 'Second response' })]
    )).rejects.toThrow();
  });

  // Soft Delete Test
  test('should support soft delete', async () => {
    // Create user
    const email = `soft-delete-user-${uuidv4()}@example.com`;
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
    const userPromptId = promptResult.insertId;

    // Create AI response
    const [aiResponseResult] = await connection.execute(
      'INSERT INTO aiResponses (userPromptId, response, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      [userPromptId, JSON.stringify({ result: 'Soft delete test response' })]
    );
    const aiResponseId = aiResponseResult.insertId;

    // Perform soft delete
    await connection.execute(
      'UPDATE aiResponses SET deletedAt = NOW() WHERE id = ?',
      [aiResponseId]
    );

    // Verify soft delete
    const [aiResponses] = await connection.execute('SELECT * FROM aiResponses WHERE id = ?', [aiResponseId]);

    expect(aiResponses[0]).toBeDefined();
    expect(aiResponses[0].deletedAt).not.toBeNull();
  });
});