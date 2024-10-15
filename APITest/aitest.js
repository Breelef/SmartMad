import {fileURLToPath} from "url";
import path from "path";
import {getLlama, LlamaChatSession, GeneralChatWrapper} from "node-llama-cpp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const llama = await getLlama();
const model = await llama.loadModel({
   modelPath: path.join(__dirname, "models", "hf_bartowski_gemma-2-2b-it-Q6_K_L.gguf")
});
const context = await model.createContext();
const session = new LlamaChatSession({
    contextSequence: context.getSequence()
});
const grammar = await llama.getGrammarFor("json");


const q1 = 'Create a message saying "hi there"';
console.log("User: " + q1);

const a1 = await session.prompt(q1, {
    grammar,
    maxTokens: context.contextSize
});
console.log("AI: " + a1);
console.log(JSON.parse(a1));


const q2 = 'Add another field to the message with "author" ' +
    'and the value being "Llama"';
console.log("User: " + q2);

const a2 = await session.prompt(q2, {
    grammar,
    maxTokens: context.contextSize
});
console.log("AI: " + a2);
console.log(JSON.parse(a2));