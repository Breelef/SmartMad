import { Router } from "express";
import passport from "passport";
import { createPrompt } from "../service/userPromptService.js";
import { createAiResponseFromPrompt } from "../service/aiResponseService.js";
import { createRecipe } from "../service/recipeService.js";
import { generateRecipe } from "../AI/gemini.js";

const router = Router();


router.post("/firstUserPrompt", async (req, res) => {
    try{
        const { userId, data } = req.body;  // Get userId and prompt from the request body
        const savedPromptId = await createPrompt(1, data);
        const response = await generateRecipe(data);
        const savedAiResponse = await createAiResponseFromPrompt(savedPromptId, response);
        res.json({ data: savedAiResponse });
    }catch (e) {
        console.error("Error creating response:", e);
        res.status(500).json({ error: "Failed to create response"});
    }
});

router.post("/recipeChosen", async (req, res) => {
    try{
        const { responseId, recipeChosenId } = req.body;
        const recipe = await createRecipe(responseId, recipeChosenId);
        res.json(recipe);
    }catch (e){
        console.error("Error creating recipe:", e);
        res.status(500).json({ error: "Failed to create recipe"});
    }
});

export default router;
