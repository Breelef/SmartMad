import dotenv from 'dotenv';
import express from 'express';
import { generateRecipe } from "./AITest/geminiTest.js";
import cors from "cors";


dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());
const port = 8080;

app.post('/testAPI', async (req, res) => {
    try {
        const { data } = req.body;
        const response = await generateRecipe(data);
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