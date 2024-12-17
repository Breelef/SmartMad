import Redis from 'ioredis';
import dotenv from "dotenv";

dotenv.config({path: "../"})
export const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
})

/**
 * Sets a value in Redis with an expiration time.
 * @param {string} key - The Redis key.
 * @param {string} value - The value to store.
 * @param {number} ttl - Time to live in seconds.
 */


export const redisSet = async (key, value, ttl) => {
    try {
        await redis.set(key, value, 'EX', ttl);
    } catch (error) {
        console.error('Failed to set value in Redis:', error);
        throw error;  // Rethrow to handle the error in the calling function
    }
};

/**
 * Gets a value from Redis.
 * @param {string} key - The Redis key.
 */
export const redisGet = async (key) => {
    try {
        return await redis.get(key);
    } catch (error) {
        console.error('Failed to get value from Redis:', error);
        return null;  // Optionally handle the error differently or rethrow
    }
};

/**
 * Checks if a token is in the blacklist.
 * @param {string} token - The token to check.
 */
export const checkTokenBlacklist = async (token) => {
    try {
        const isBlacklisted = await redisGet(`blacklisted:${token}`);
        return !!isBlacklisted;  // Convert to boolean
    } catch (error) {
        console.error('Error checking token blacklist:', error);
        return false;  // Assume not blacklisted if the operation fails
    }
};