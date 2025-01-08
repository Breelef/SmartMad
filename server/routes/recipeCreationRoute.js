import { Router } from "express";
import { createPrompt } from "../service/userPromptService.js";
import { createAiResponseFromPrompt } from "../service/aiResponseService.js";
import { createRecipe } from "../service/recipeService.js";
import { generateRecipe } from "../AI/gemini.js";
import { generateResponseForUser } from "../AI/gemini.js";
import {authenticateToken} from "../middleware/auth.js";
import {extractAuthToken, verifyToken} from "../auth/authHelpers.js";
import { findUserByToken } from "../service/userService.js";


const router = Router();


router.post("/firstUserPrompt", authenticateToken, async (req, res) => {
      try {
        const { data } = req.body;
        const user = await findUserByToken(req);
        const savedPromptId = await createPrompt(user.id, data);
        const response = await generateRecipe(data);
        const savedAiResponse = await createAiResponseFromPrompt(savedPromptId, response);
        const jsonRecipes = JSON.parse(savedAiResponse.response);
        const AIResponseAndRecipesInJSON = {savedAiResponse, jsonRecipes}
        res.status(200).json({ status: 'success', data: AIResponseAndRecipesInJSON });
      } catch (e) {
        console.error("Error creating response:", e);
        res.status(500).json({
          status: 'error',
          message: 'Failed to create response',
          details: e.message || 'Internal server error',
        });
      }
});

router.post("/generateRecipeResponse", async (req, res) => {
    console.log("Request received in generateRecipeResponse:", req.body);
    try {
        const { userMessage, recipe } = req.body;
        console.log("userMessage", userMessage, "recipe", recipe);
        const response = await generateResponseForUser(userMessage, recipe);
        res.json({ answer: response });
    } catch (error) {
        console.error("Error processing the request:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

router.post("/recipeChosen", async (req, res) => {
    try{
        const { responseId, recipeChosenIndex } = req.body;
        const recipe = await createRecipe(responseId, recipeChosenIndex);
        res.json(recipe);
    }catch (e){
        console.error("Error creating recipe:", e);
        res.status(500).json({ error: "Failed to create recipe"});
    }
});

router.get("/getToken", authenticateToken, (req, res) => {
    const token = extractAuthToken(req);
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    res.json(decoded);
});

export default router;
