import { Router } from "express";
import passport from "passport";
import { PrismaClient } from '@prisma/client';
import { generateRecipe } from "../AI/gemini.js";

const router = Router();
const prisma = new PrismaClient();

router.post("/aiResponse", async (req, res) => {
  const { userId, prompt } = req.body;  // Get userId and prompt from the request body

  try {
    const userPrompt = await prisma.userPrompt.create({
      data: {
        userId,
        prompt,
      },
    });
     console.log('UserPrompt created successfully', JSON.stringify(userPrompt));
     const promptId = userPrompt.id;
     try{
          const aiResponse = await generateRecipe(prompt);
          const response = aiResponse.data;

          //Logik til tjekke svaret

          await prisma.aIResponse.create({
               promptId,
               response,
          });
          //Service til at gemme opskriften?
          //Eller skal vi vente til de har valgt en endelig opskrift med at gemme den?
          //Ved ikke helt hvordan vi laver den her backend haha
          //Men det er også en fed udfordring
     }catch (e){
          console.error("Error creating aiResponse:", e);
          res.status(500).json({
          message: 'Failed to create UserPrompt',
          error: e.message,
    });
     }
  } catch (error) {
    console.error("Error creating UserPrompt:", error);
    res.status(500).json({
      message: 'Failed to create UserPrompt',
      error: error.message,
    });
  }
});