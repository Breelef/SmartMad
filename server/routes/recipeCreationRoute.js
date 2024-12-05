import { Router } from "express";
import passport from "passport";
import { createPrompt } from "../service/userPromptService.js";
import { createAiResponseFromPrompt } from "../service/aiResponseService.js";
import { createRecipe } from "../service/recipeService.js";
import { generateRecipe } from "../AI/gemini.js";

const router = Router();


router.post("/firstUserPrompt", async (req, res) => {
  const { userId, prompt } = req.body;  // Get userId and prompt from the request body
    const savedPromptId = await createPrompt(userId, prompt);
    const response = await generateRecipe(prompt);
    const savedAiResponse = createAiResponseFromPrompt(savedPromptId, response);
    res.json({ savedAiResponse });
});

router.post("/recipeChosen", async (req, res) => {
    try{
        const { responseId, recipeChosenId } = req.body;
        const recipe = await createRecipe(responseId);
        res.json(recipe)
    }catch (e){
        console.error("Error creating recipe:", e);
        res.status(500).json({ error: "Failed to create recipe"});
    }
});

export default router;
