import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";
import {getLlama, LlamaChatSession} from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function initializeAI() {
  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.join(__dirname, "models", "hf_mradermacher_Meta-Llama-3.1-8B-Instruct.Q6_K.gguf")
  });
  const context = await model.createContext();
  const session = new LlamaChatSession({
    contextSequence: context.getSequence()
  });
  const grammar = await llama.getGrammarFor("json");

  return { session, grammar, context };
}

function readJSONFile(filename) {
  const filePath = path.join(__dirname, filename);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading or parsing the file ${filename}:`, err);
    return null;
  }
}

async function generateRecipe({ session, grammar, context }) {
  const userInput = readJSONFile("JSONstructureInput.json");
  const outputStructure = readJSONFile("JSONstructureOutputSkeleton.json");
  if (!userInput || !outputStructure) {
    throw new Error("Failed to read input or output JSON files");
  }

  const prompt = `
You are a creative cooking instruction bot. Your task is to generate a unique and original recipe based on the following input:

${JSON.stringify(userInput, null, 2)}

Create a NEW recipe that uses the given ingredients and matches the user's preferences. Be creative and original.

Your response should be a JSON object following this structure:

${JSON.stringify(outputStructure, null, 2)}

Fill in all fields with appropriate content. Be creative with the recipe name, ingredients, and instructions while staying true to the user's input and preferences. Ensure that your response is a valid JSON object.
`;

  const response = await session.prompt(prompt, {
    grammar,
    maxTokens: context.contextSize
  });

  return JSON.parse(response);
}

// Usage
async function main() {
  const ai = await initializeAI();
  const recipe = await generateRecipe(ai);
  console.log(JSON.stringify(recipe, null, 2));
}

main().catch(console.error);