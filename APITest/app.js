import dotenv from 'dotenv';
import express from 'express';
import { generateRecipe } from "./AITest/geminiTest.js";


dotenv.config()

const app = express();
app.use(express.json());
const port = 3000;

app.post('/testAPI', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await generateRecipe(message);
        console.log(response);
        res.json({ response });
    } catch (error) {
        console.error('Error generating recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});