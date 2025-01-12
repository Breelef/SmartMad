import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';

describe('User Model Integration Tests', () => {
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

  // Basic User Creation Test
  test('should create a user with all fields', async () => {
    const email = `test-${uuidv4()}@example.com`;
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, oauthId, oauthProvider, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      ['Test User', email, 'hashedpassword', 'oauth123', 'google']
    );

    const [users] = await connection.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);

    expect(users[0]).toBeDefined();
    expect(users[0].name).toBe('Test User');
    expect(users[0].email).toBe(email);
    expect(users[0].password).toBe('hashedpassword');
    expect(users[0].oauthId).toBe('oauth123');
    expect(users[0].oauthProvider).toBe('google');
  });

  // Unique Email Constraint Test
  test('should enforce unique email constraint', async () => {
    const email = `unique-${uuidv4()}@example.com`;

    // First user creation should succeed
    await connection.execute(
      'INSERT INTO users (name, email, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      ['First User', email]
    );

    // Second user creation with same email should fail
    await expect(connection.execute(
      'INSERT INTO users (name, email, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      ['Second User', email]
    )).rejects.toThrow();
  });

  // Optional Fields Test
  test('should create user with minimal required fields', async () => {
    const email = `minimal-${uuidv4()}@example.com`;
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      ['Minimal User', email]
    );

    const [users] = await connection.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);

    expect(users[0]).toBeDefined();
    expect(users[0].name).toBe('Minimal User');
    expect(users[0].email).toBe(email);
    expect(users[0].password).toBeNull();
    expect(users[0].oauthId).toBeNull();
    expect(users[0].oauthProvider).toBeNull();
  });

  // Soft Delete Test
  test('should support soft delete with deletedAt', async () => {
    const email = `delete-${uuidv4()}@example.com`;
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())',
      ['Delete Test User', email]
    );
    const userId = result.insertId;

    // Perform soft delete
    await connection.execute(
      'UPDATE users SET deletedAt = NOW() WHERE id = ?',
      [userId]
    );

    const [users] = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);

    expect(users[0]).toBeDefined();
    expect(users[0].deletedAt).not.toBeNull();
  });
});