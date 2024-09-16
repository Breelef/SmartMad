import dotenv from 'dotenv';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
app.use(express.json());
const port = 3000;

app.post('/testAPI', async (req, res) => {
    const { message } = req.body;

    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        messages: [{ role: 'user', content: message }],
    });

    res.json({ response });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});