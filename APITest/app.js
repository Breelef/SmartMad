import dotenv from 'dotenv';
import express from 'express';
import { generateRecipe } from "./AITest/geminiTest.js";
import cors from "cors";
import { addRecipe, addIngredients, addInstructions } from '../server/service/recipeService.js';


dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());
const port = 8080;


app.post('/testAPI', async (req, res) => {
    try {
        const { data } = req.body;
        const response = await generateRecipe(data);

        const userId = 1;
        const recipeId = await addRecipe(userId, response);
        await addIngredients(recipeId, response.data.ingredients);
        await addInstructions(recipeId, response.data.instructions);

        res.json({ response });
    } catch (error) {
        console.error('Error generating recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});