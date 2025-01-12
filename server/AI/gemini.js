import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";


dotenv.config();

const __filename = path.resolve(process.cwd());
const __dirname = path.dirname(__filename);

// Initialize the Gemini model
async function initializeAI() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// Read JSON files
export function readJSONFile(filename) {
  const filePath = path.resolve(__dirname, 'server/AI/JSON', filename);
  console.log('Full file path being accessed:', filePath);
  console.log('Current directory:', __dirname);
  console.log('Target file path:', path.resolve(__dirname, 'server/AI/JSON', filename));

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading or parsing the file ${filename}:`, err);
    return null;
  }
}

function cleanText(rawText) {
  if (!rawText) {
    throw new Error("The model did not return a valid JSON response.");
  }
  return rawText.replace(/```json|```|```json|```/g, '').trim();
}

export async function generateRecipe(userJSON) {
  const model = await initializeAI();
  const outputStructure = readJSONFile("JSONstructureOutputSkeleton.json");

  if (!outputStructure) {
    throw new Error("Failed to read input or output JSON files");
  }

  const prompt = `...`; // Keep your original prompt logic

  try {
    const result = await model.generateContent(prompt);

    const responseText = result.response.text(); // Get the text from the model's response

    // Check if the response text is valid JSON
    try {
      JSON.parse(responseText);
    } catch (e) {
      console.error("Invalid JSON response:", responseText);
      throw new Error("The model did not return a valid JSON response.");
    }

    console.log(responseText);
    return cleanText(responseText); // Now that we confirmed it's valid JSON, clean it
  } catch (error) {
    console.error("Failed to parse JSON response");
    throw new Error("The model did not return a valid JSON response.");
  }
}



export async function generateResponseForUser(userText, recipe) {
  const model = await initializeAI();

  const prompt = `...`; // Keep your original prompt logic

  try {
    const result = await model.generateContent(prompt);

    const responseText = result.response.text(); // Get the text from the model's response

    // Check if the response text is valid JSON
    try {
      JSON.parse(responseText);
    } catch (e) {
      console.error("Invalid JSON response:", responseText);
      throw new Error("The model did not return a valid JSON response.");
    }

    const cleanedText = cleanText(responseText);
    return cleanedText;
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    throw new Error("The model did not return a valid JSON response.");
  }
}
