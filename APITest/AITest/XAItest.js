import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.X_API_KEY);
const XAI_API_KEY = process.env.X_API_KEY;
const MODEL_NAME = "grok-beta"; // Use the model name from your use case

const openai = new OpenAI({
  apiKey: XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const functions = []; // Define the functions array if needed

// Define tools based on the functions array
const tools = functions.map(f => ({
  type: "function",
  function: f,
}));

const messages = [
  { role: "system", content: "You are a helpful webpage navigation assistant. Use the supplied tools to assist the user." },
  { role: "user", content: "Hi, Grok I am making a recipe app with AI generated recipes. Why should i use you?" }
];

async function getChatCompletion() {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages,
      functions: tools,  // Include the tools if necessary
    });
    console.log(response.choices[0].message);
  } catch (error) {
    console.error("Error fetching completion:", error);
  }
}

getChatCompletion();
