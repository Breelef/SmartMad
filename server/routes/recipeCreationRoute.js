import { Router } from "express";
import passport from "passport";
import { createPrompt } from "../service/userPromptService.js";
import { createAiResponseFromPrompt } from "../service/aiResponseService.js";
import { createRecipe } from "../service/recipeService.js";
import { generateRecipe } from "../AI/gemini.js";

const router = Router();


router.post("/firstUserPrompt", async (req, res) => {
    try{
        const { userId, data } = req.body;
        const savedPromptId = await createPrompt(1, data);

        const response = await generateRecipe(data); 

        console.log(response);
        const list = response.recipes;
        console.log(list)

        const savedAiResponse = await createAiResponseFromPrompt(savedPromptId, response);

        const jsonStrings = response.split('$').map(str => str.trim()).filter(Boolean);
        const jsonObjects = jsonStrings.map((str, index) => {
            try {
                return JSON.parse(str);
            } catch (parseError) {
                console.error(`Error parsing JSON at index ${index}:`, parseError);
                return null; 
            }
        }).filter(obj => obj !== null);
        

        res.json({ recipes: jsonObjects });

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
