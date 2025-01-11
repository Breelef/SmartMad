import { mockReset } from 'jest-mock-extended';
import { prisma } from './client.js'; // Import the mocked Prisma instance

beforeEach(() => {
  mockReset(prisma); // Reset mock state before each test
});

export { prisma }; // Export the mocked prisma for use in tests
