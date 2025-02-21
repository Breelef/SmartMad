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
export function readJSONFile() {
  const filePath = path.resolve('./JSON/JSONstructureOutputSkeleton.json');
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading or parsing the file`, err);
    return null;
  }
}

function cleanText(rawText) {
  return rawText.replace(/```json|```|```json|```/g, '')
    .trim();
}

export async function generateRecipe(userJSON) {
  const model = await initializeAI();
  const outputStructure = readJSONFile();

  if (!outputStructure) {
    throw new Error("Failed to read input or output JSON files");
  }

  const prompt = `
You are a creative cooking instruction bot. Your task is to generate a unique and original recipe based on the following input:

${JSON.stringify(userJSON, null, 2)}

Create Three NEW recipes inside an array of a json object that uses the given ingredients and matches the user's preferences. Be creative and original.

Your response should be in 1 JSON file and in danish language and follow this schema:

${JSON.stringify(outputStructure, null, 2)}

Fill in all fields with appropriate content. Be creative with the recipe name, ingredients, and instructions while staying true to the user's input and preferences. Ensure that your response is a valid JSON object.
If the measurements is in fractions then convert them to decimals, If the recipe includes any kind of meat that needs preparation, also add the process of preparing it as a part of the preparation steps.
If ingredient value is a comment like "Efter smag" then just put null and use the comment attribute`;



  const result = await model.generateContent(prompt);
  const cleanedText = cleanText(result.response.text());
  try {
    return cleanedText;
  } catch (error) {
    console.error("Failed to parse JSON response");
    throw new Error("The model did not return a valid JSON response.");
  }
}



export async function generateResponseForUser(userText, recipe) {
  const model = await initializeAI();

  const prompt = `
You are a creative cooking instruction bot. Your task is to help the user with the following recipe: 
${JSON.stringify(recipe, null, 2)}
With this recipe in mind, the user has the following question:
${JSON.stringify(userText, null, 2)}
Answer the question in danish. and be as specific as possible. give the answer in 3 sentences.
`

  const result = await model.generateContent(prompt);
  const cleanedText = cleanText(result.response.text());
  try {
    return cleanedText;
  } catch (error) {
    console.error("Failed to parse JSON response");
    throw new Error("The model did not return a valid JSON response.");
  }
}

