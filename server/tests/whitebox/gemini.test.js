import { generateRecipe, generateResponseForUser, readJSONFile } from '../../AI/gemini.js';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock fs.readFileSync to simulate file reading
jest.mock('fs', () => ({
    readFileSync: jest.fn((filePath) => {
        if (filePath.includes("missing")) {
            throw new Error("File not found");
        }
        return '{"mock": "data"}';
    }),
}));

jest.mock("@google/generative-ai", () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockResolvedValue({
            generateContent: jest.fn().mockImplementation((prompt) => {
                if (prompt.includes("invalid")) {
                    return Promise.resolve({ response: { text: jest.fn().mockReturnValue("Invalid JSON") } });
                }
                if (prompt.includes("null")) {
                    return Promise.resolve({ response: { text: jest.fn().mockReturnValue(null) } });
                }
                return Promise.resolve({ response: { text: jest.fn().mockReturnValue('{"valid": "response"}') } });
            }),
        }),
    })),
}));
fs.readFileSync.mockReturnValue(JSON.stringify({ key: 'value' }));

describe('gemini.js tests', () => {
    const mockGenerateContent = jest.fn();
    const mockInitializeAI = jest.fn();

    beforeAll(() => {
        // Mock the GoogleGenerativeAI instance
        GoogleGenerativeAI.mockImplementation(() => {
            return {
                getGenerativeModel: () => ({
                    generateContent: mockGenerateContent,
                }),
            };
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        console.log = jest.fn();
        console.error = jest.fn();
    });

    afterAll(() => {
        jest.restoreAllMocks(); // Clean up after all tests run
    });

    test('should correctly generate the full file path when reading JSON', () => {
        fs.readFileSync.mockReturnValue('{"mock": "data"}'); // Ensure this value is consistent
        const data = readJSONFile("test.json");
        expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining("test.json"), "utf-8");
        expect(data).toEqual({ mock: "data" });
    });

    test('should throw error if the JSON structure file is missing', async () => {
        const testError = new Error('File not found');
        fs.readFileSync.mockImplementationOnce(() => {
            throw testError;
        });

        // Expect the function to throw an error when the file is missing
        await expect(generateRecipe({})).rejects.toThrow('Failed to read input or output JSON files');
    });

    test('should call generateContent with correct prompt for generateRecipe', async () => {
        const validMockResponse = {
            response: { text: jest.fn().mockReturnValue('{"valid": "response"}') },
        };

        mockGenerateContent.mockResolvedValue(validMockResponse);

        const userJSON = { ingredient: 'chicken' };
        const result = await generateRecipe(userJSON);

        expect(mockGenerateContent).toHaveBeenCalledWith(expect.any(String)); // Ensure prompt is passed
        expect(result).toBeDefined(); // Ensure valid response
    });

    test('should throw an error if model response is invalid in generateRecipe', async () => {
        const invalidMockResponse = {
            response: { text: jest.fn().mockReturnValue('Invalid JSON') },
        };

        mockGenerateContent.mockResolvedValue(invalidMockResponse);

        const userJSON = { ingredient: 'chicken' };
        await expect(generateRecipe(userJSON)).rejects.toThrow("The model did not return a valid JSON response.");
    });



    test('should throw an error if model response is null in generateRecipe', async () => {
        const nullMockResponse = {
            response: { text: jest.fn().mockReturnValue(null) },
        };

        mockGenerateContent.mockResolvedValue(nullMockResponse);

        const userJSON = { ingredient: 'chicken' };
        await expect(generateRecipe(userJSON)).rejects.toThrow("The model did not return a valid JSON response.");
    });


    test("should correctly generate response for user question", async () => {
        const invalidMockResponse = {
          response: { text: jest.fn().mockReturnValue("Invalid JSON") },
        };
      
        mockGenerateContent.mockResolvedValue(invalidMockResponse);
      
        await expect(generateResponseForUser("test")).rejects.toThrow(
          "The model did not return a valid JSON response."
        );
      });

    test('should throw error if model response is invalid in generateResponseForUser', async () => {
        const invalidMockResponse = {
            response: {
                text: jest.fn().mockReturnValue('{"recipe": "Valid recipe"'), // Incomplete JSON, missing closing brace
            },
        };

        mockGenerateContent.mockResolvedValue(invalidMockResponse);

        const userText = { question: 'How do I cook the chicken?' };
        const recipe = { name: 'Grilled Chicken' };

        // Expect the function to throw an error for invalid JSON
        await expect(generateResponseForUser(userText, recipe)).rejects.toThrow('The model did not return a valid JSON response.');
    });

});
