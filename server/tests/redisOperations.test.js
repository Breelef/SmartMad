import Redis from 'ioredis';
import { redisSet, redisGet, checkTokenBlacklist } from '../auth/redisOperations';

jest.mock('ioredis', () => {
  const mRedis = {
    set: jest.fn().mockResolvedValue('OK'),  // Mock the set function to always resolve successfully
    get: jest.fn().mockResolvedValue('testValue'),
  };
  return jest.fn(() => mRedis);  // Return the mock object when new Redis() is called
});

// Mock console.error to suppress the error messages during tests
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Redis Operations', () => {
  let redis;

  beforeEach(() => {
    // Initialize the mocked Redis client
    redis = new Redis();
    jest.clearAllMocks();
  });

  describe('redisSet', () => {
    it('should set value with expiration', async () => {
      await redisSet('testKey', 'testValue', 3600);
      expect(redis.set).toHaveBeenCalledWith('testKey', 'testValue', 'EX', 3600);
    });

    it('should throw error on Redis failure', async () => {
      redis.set.mockRejectedValue(new Error('Redis error'));
      await expect(redisSet('testKey', 'testValue', 3600)).rejects.toThrow('Redis error');
    });
  });

  describe('redisGet', () => {
    it('should get value from Redis', async () => {
      const result = await redisGet('testKey');
      expect(redis.get).toHaveBeenCalledWith('testKey');
      expect(result).toBe('testValue');
    });

    it('should return null on Redis failure', async () => {
      redis.get.mockRejectedValue(new Error('Redis error'));
      const result = await redisGet('testKey');
      expect(result).toBeNull();
    });
  });

  describe('checkTokenBlacklist', () => {
    it('should return true for blacklisted token', async () => {
      redis.get.mockResolvedValue('true');
      const result = await checkTokenBlacklist('testToken');
      expect(redis.get).toHaveBeenCalledWith('blacklisted:testToken');
      expect(result).toBe(true);
    });

    it('should return false for non-blacklisted token', async () => {
      redis.get.mockResolvedValue(null);
      const result = await checkTokenBlacklist('testToken');
      expect(result).toBe(false);
    });
  });
});
