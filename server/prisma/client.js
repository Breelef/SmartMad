import { mockDeep } from 'jest-mock-extended'; // Ensure jest-mock-extended is used for mocking

// Mock the PrismaClient instance
const prisma = mockDeep();

export { prisma };
