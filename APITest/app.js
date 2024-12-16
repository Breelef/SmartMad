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

        console.log(response)

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
    } catch (error) {
        console.error('Error generating recipe:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});