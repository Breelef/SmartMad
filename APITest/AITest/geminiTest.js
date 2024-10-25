import {GoogleGenerativeAI} from "@google/generative-ai";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize the Gemini model
async function initializeAI() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({model: "gemini-1.5-flash"});
}

// Read JSON files
function readJSONFile(filename) {
  const filePath = path.join(__dirname, filename);
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading or parsing the file ${filename}:`, err);
    return null;
  }
}

function cleanText(rawText) {
    return rawText.replace(/```json|```|```json|```/g, '')
                  .trim();
}

// Generate recipe based on JSON schema
export async function generateRecipe(userJSON) {
  const userInput = readJSONFile(userJSON);
  const outputStructure = readJSONFile("../JSONstructureOutputSkeleton.json");

  if (!userInput || !outputStructure) {
    throw new Error("Failed to read input or output JSON files");
  }

  const prompt = `
You are a creative cooking instruction bot. Your task is to generate a unique and original recipe based on the following input:

${JSON.stringify(userInput, null, 2)}

Create a NEW recipe that uses the given ingredients and matches the user's preferences. Be creative and original.

Your response should be in JSON format and follow this schema:

${JSON.stringify(outputStructure, null, 2)}

Fill in all fields with appropriate content. Be creative with the recipe name, ingredients, and instructions while staying true to the user's input and preferences. Ensure that your response is a valid JSON object.
If the measurements is in fractions then convert them to decimals`;

  // Generate the recipe using Gemini's content generation
  const result = await model.generateContent(prompt);
  const cleanedText = cleanText(result.response.text());
  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse JSON response:", cleanedText);
    throw new Error("The model did not return a valid JSON response.");
  }
}

// Usage
async function main() {
  try {
    const model = await initializeAI();
    const recipe = await generateRecipe(model);
    console.log(JSON.stringify(recipe, null, 2));
  } catch (error) {
    console.error("Error generating recipe:", error);
  }
}

main();
