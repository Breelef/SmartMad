import { createRecipe } from '../service/recipeService.js';
import { PrismaClient } from '@prisma/client';
import { getAiResponseFromId } from '../service/aiResponseService.js';
import { createInstructionsFromRecipe } from '../service/instructionsService.js';
import { createIngredientFromRecipe } from '../service/ingredientService.js';

// Mock Prisma client
jest.mock('@prisma/client', () => {
  const mockRecipe = {
    create: jest.fn(),
    findUnique: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      recipe: mockRecipe,
    })),
  };
});

// Mock services
jest.mock('../service/aiResponseService.js');
jest.mock('../service/instructionsService.js');
jest.mock('../service/ingredientService.js');

describe('createRecipe', () => {
  let prisma;

  const testRecipe = {
    name: 'Test Recipe',
    prep: { value: 10 },
    cook: { value: 20 },
    portionSize: 4,
    final_comment: 'Delicious!',
    instructions: [],
    ingredients: [],
  };

  const mockCreatedRecipe = {
    id: 1,
    aiResponseId: 1,
    name: 'Test Recipe',
    prep: { value: 10 },
    cook: { value: 20 },
    portionSize: 4,
    final_comment: 'Delicious!',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient();
  });

  // Helper function to setup common mocks
  const setupMockAiResponse = (recipes) => {
    getAiResponseFromId.mockResolvedValue({ recipes });
    prisma.recipe.create.mockResolvedValue(mockCreatedRecipe);
    prisma.recipe.findUnique.mockResolvedValue({
      ...mockCreatedRecipe,
      instructions: [],
      ingredients: [],
    });
  };

  it('should store all recipe information correctly', async () => {
    // Arrange
    setupMockAiResponse([testRecipe]);

    // Act
    const result = await createRecipe(1, 0);

    // Assert
    expect(result).toEqual({
      ...mockCreatedRecipe,
      instructions: [],
      ingredients: [],
    });
    expect(prisma.recipe.create).toHaveBeenCalledWith({
      data: {
        aiResponseId: 1,
        name: 'Test Recipe',
        prep: { value: 10 },
        cook: { value: 20 },
        portionSize: 4,
        final_comment: 'Delicious!',
      },
    });
    expect(createInstructionsFromRecipe).toHaveBeenCalledWith([], 1);
    expect(createIngredientFromRecipe).toHaveBeenCalledWith([], 1);
  });

  it('should handle non-existent recipe index gracefully', async () => {
    // Arrange
    setupMockAiResponse([testRecipe]);

    // Act & Assert
    await expect(createRecipe(1, 1)).rejects.toThrow('Invalid recipe index');
  });

  it('should handle AI response with no recipes', async () => {
    // Arrange
    setupMockAiResponse([]);

    // Act & Assert
    await expect(createRecipe(1, 0)).rejects.toThrow('Invalid recipe index');
  });
});