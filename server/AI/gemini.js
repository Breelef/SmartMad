import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize the Gemini model
async function initializeAI() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({model: "gemini-1.5-flash"});
}

// Read JSON files
function readJSONFile(filename) {
  const filePath = path.join(__dirname + filename);
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

export async function generateRecipe(userJSON) {
  const model = await initializeAI();
  const outputStructure = readJSONFile("/JSON/JSONstructureOutputSkeleton.json");

  if (!outputStructure) {
    throw new Error("Failed to read input or output JSON files");
  }

  const prompt = `
You are a creative cooking instruction bot. Your task is to generate a unique and original recipe based on the following input:

${JSON.stringify(userJSON, null, 2)}

Create a NEW recipe that uses the given ingredients and matches the user's preferences. Be creative and original.

Your response should be in JSON format and in danish language and follow this schema:

${JSON.stringify(outputStructure, null, 2)}

Fill in all fields with appropriate content. Be creative with the recipe name, ingredients, and instructions while staying true to the user's input and preferences. Ensure that your response is a valid JSON object.
If the measurements is in fractions then convert them to decimals, If the recipe includes any kind of meat that needs preparation, also add the process of preparing it as a part of the preparation steps.`;

  const result = await model.generateContent(prompt);
  const cleanedText = cleanText(result.response.text());
  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse JSON response:", cleanedText);
    throw new Error("The model did not return a valid JSON response.");
  }
}
