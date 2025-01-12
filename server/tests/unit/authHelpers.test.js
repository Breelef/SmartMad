import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { generateToken, verifyToken, decodeToken, comparePasswords, hashPassword, extractAuthToken } from '../../auth/authHelpers.js';

jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('Auth Helpers', () => {
  const mockEmail = 'test@example.com';
  const mockSecret = 'testSecret';
  const mockToken = 'header.payload.signature';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      jwt.sign.mockReturnValue(mockToken);
      const token = generateToken(mockEmail, mockSecret, '1h');
      expect(jwt.sign).toHaveBeenCalledWith({ email: mockEmail }, mockSecret, { expiresIn: '1h' });
      expect(token).toBe(mockToken);
    });
  });

  describe('verifyToken', () => {
  it('should verify a valid token', () => {
    jwt.verify.mockReturnValue({ email: mockEmail });
    const result = verifyToken(mockToken, mockSecret);
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockSecret);
    expect(result).toEqual({ email: mockEmail });
  });

  it('should throw error for invalid token format', () => {
    // Mock console.error to suppress logs during the test
    console.error = jest.fn();

    expect(() => verifyToken('invalid.token', mockSecret)).toThrow('Invalid token format');
    expect(console.error).toHaveBeenCalledWith('Error: Invalid token format');
  });
});

describe('decodeToken', () => {
  it('should decode a valid token', () => {
    jwt.decode.mockReturnValue({ email: mockEmail });
    const result = decodeToken(mockToken);
    expect(jwt.decode).toHaveBeenCalledWith(mockToken);
    expect(result).toEqual({ email: mockEmail });
  });

  it('should throw error for invalid token format', () => {
    // Mock jwt.decode to return null for invalid token
    jwt.decode.mockReturnValue(null);
    console.error = jest.fn();

    expect(() => decodeToken('invalid.token')).toThrow('Invalid token format');
    expect(console.error).toHaveBeenCalledWith('Error: Invalid token format');
  });
});

  describe('comparePasswords', () => {
    it('should return true for matching passwords', async () => {
      bcrypt.compare.mockResolvedValue(true);
      const result = await comparePasswords('password', 'hashedPassword');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(result).toBe(true);
    });
  });

  describe('hashPassword', () => {
    it('should hash password with default salt rounds', async () => {
      bcrypt.hash.mockResolvedValue('hashedPassword');
      const result = await hashPassword('password');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 12);
      expect(result).toBe('hashedPassword');
    });
  });

  describe('extractAuthToken', () => {
      it('should extract token from Authorization header', () => {
        const req = {
          headers: { authorization: 'Bearer testToken' },  // Ensure headers is defined
          cookies: {}  // Even if cookies are not used, define it as an empty object
        };
        expect(extractAuthToken(req)).toBe('testToken');
      });

      it('should extract token from cookies', () => {
        const req = {
          headers: {},  // Ensure headers is defined, but empty
          cookies: { authToken: 'testToken' }  // Ensure cookies is an object with authToken
        };
        expect(extractAuthToken(req)).toBe('testToken');
      });

      it('should return null if no token found', () => {
        const req = { headers: {}, cookies: {} };  // Both headers and cookies are empty objects
        expect(extractAuthToken(req)).toBeNull();
      });
    });
});