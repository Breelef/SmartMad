import { prismaMock } from '../prisma/singleton.js'; // Import the prismaMock
import {
  findUserByEmail,
  findUserById,
  findUserByToken,
  createUser,
  findAllUsers,
  softDeleteUserById,
  deleteUserPermanently
} from "../service/userService.js";
import { extractAuthToken, verifyToken, hashPassword } from "../auth/authHelpers";

jest.mock('../prisma/client.js', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock the auth helper functions
jest.mock("../auth/authHelpers", () => ({
  extractAuthToken: jest.fn(),
  verifyToken: jest.fn(),
  hashPassword: jest.fn().mockImplementation((password) => `hashed-${password}`), // Mock hashPassword
}));

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should return a user when email matches', async () => {
      const mockUserPassword = 'hashed-UnitTestPassword';
      const mockUser = { email: 'UnitTest@example.com', name: 'Unit Test User', password: mockUserPassword };

      // Mock the behavior of findFirst
      prismaMock.user.findFirst.mockResolvedValue(mockUser);

      // Call the function and check the results
      const user = await findUserByEmail('UnitTest@example.com');
      console.log(user); // Check what is being returned
      expect(user).toEqual(mockUser);
      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { email: 'UnitTest@example.com' } });
    });

    it('should return null if no user is found', async () => {
      // Mock the case where no user is found
      prismaMock.user.findFirst.mockResolvedValue(null);

      const user = await findUserByEmail('nonexistent@example.com');
      console.log(user); // Check what is being returned
      expect(user).toBeNull();
    });
  });

  // describe('findUserById', () => {
  //   it('should return a user when ID is valid', async () => {
  //     const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
  //     prismaMock.user.findUnique.mockResolvedValue(mockUser);
  //
  //     const user = await findUserById(1);
  //     expect(user).toEqual(mockUser);
  //     expect(prismaMock.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  //   });
  //
  //   it('should return null if no user is found', async () => {
  //     prismaMock.user.findUnique.mockResolvedValue(null);
  //
  //     const user = await findUserById(999);
  //     expect(user).toBeNull();
  //   });
  // });
  //
  // describe('findUserByToken', () => {
  //   it('should return a user when token is valid', async () => {
  //     const mockToken = 'valid_token';
  //     const mockDecoded = { email: 'test@example.com' };
  //     const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
  //
  //     extractAuthToken.mockReturnValue(mockToken);
  //     verifyToken.mockReturnValue(mockDecoded);
  //     prismaMock.user.findFirst.mockResolvedValue(mockUser);
  //
  //     const user = await findUserByToken({ headers: { authorization: 'Bearer valid_token' } });
  //     expect(user).toEqual(mockUser);
  //     expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
  //   });
  //
  //   it('should throw an error if token is invalid', async () => {
  //     extractAuthToken.mockReturnValue(null);
  //     verifyToken.mockImplementation(() => { throw new Error('Invalid token'); });
  //
  //     await expect(findUserByToken({})).rejects.toThrow('Error finding user: Error: Invalid token');
  //   });
  // });
  //
  // describe('createUser', () => {
  //   it('should create a new user when email is unique', async () => {
  //     const newUser = { id: 1, email: 'test@example.com', password: 'password', name: 'Test User' };
  //     prismaMock.user.findUnique.mockResolvedValue(null);  // No user exists with the email
  //     prismaMock.user.create.mockResolvedValue(newUser);
  //
  //     const result = await createUser('test@example.com', 'password', 'Test User');
  //     expect(result).toEqual({ id: 1, name: 'Test User', email: 'test@example.com' });
  //     expect(prismaMock.user.create).toHaveBeenCalledWith({
  //       data: { email: 'test@example.com', password: 'password', name: 'Test User' },
  //     });
  //   });
  //
  //   it('should throw an error if user with email already exists', async () => {
  //     prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'test@example.com' });
  //
  //     await expect(createUser('test@example.com', 'password', 'Test User')).rejects.toThrow('User with this email already exists');
  //   });
  // });
  //
  // describe('findAllUsers', () => {
  //   it('should return a list of users', async () => {
  //     const users = [{ id: 1, email: 'test@example.com', name: 'Test User' }];
  //     prismaMock.user.findMany.mockResolvedValue(users);
  //
  //     const result = await findAllUsers();
  //     expect(result).toEqual(users);
  //     expect(prismaMock.user.findMany).toHaveBeenCalled();
  //   });
  //
  //   it('should throw an error if fetching users fails', async () => {
  //     prismaMock.user.findMany.mockRejectedValue(new Error('Database error'));
  //
  //     await expect(findAllUsers()).rejects.toThrow('Failed to fetch users');
  //   });
  // });
  //
  // describe('softDeleteUserById', () => {
  //   it('should soft delete a user by ID', async () => {
  //     const mockUser = { id: 1, deletedAt: new Date() };
  //     prismaMock.user.update.mockResolvedValue(mockUser);
  //
  //     const result = await softDeleteUserById(1);
  //     expect(result).toEqual(mockUser);
  //     expect(prismaMock.user.update).toHaveBeenCalledWith({
  //       where: { id: 1 },
  //       data: { deletedAt: expect.any(Date) },
  //     });
  //   });
  //
  //   it('should throw an error if soft-deletion fails', async () => {
  //     prismaMock.user.update.mockRejectedValue(new Error('Database error'));
  //
  //     await expect(softDeleteUserById(1)).rejects.toThrow('Error soft-deleting user');
  //   });
  // });
  //
  // describe('deleteUserPermanently', () => {
  //   it('should permanently delete a user by ID', async () => {
  //     const mockUser = { id: 1 };
  //     prismaMock.user.delete.mockResolvedValue(mockUser);
  //
  //     const result = await deleteUserPermanently(1);
  //     expect(result).toEqual(mockUser);
  //     expect(prismaMock.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  //   });
  //
  //   it('should throw an error if permanent deletion fails', async () => {
  //     prismaMock.user.delete.mockRejectedValue(new Error('Database error'));
  //
  //     await expect(deleteUserPermanently(1)).rejects.toThrow('Error permanently deleting user');
  //   });
  // });
});
