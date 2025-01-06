import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createAiResponseFromPrompt(promptId, aiResponse) {
    try {
        const id = promptId.id;
        return await prisma.aIResponse.create({
            data: {
                userPromptId: id,
                response: aiResponse,
            },
        });
    } catch (e) {
        console.error("Error creating AiResponse:", e);
        return e;
    }
}

export async function getAiResponseFromId(responseId) {
    try {
        return await prisma.aIResponse.findUnique({
            where: {
                id: responseId,
            },
        });
    } catch (e) {
        console.error(`Error fetching AiResponse on Id: ${responseId}`, e);
        return e;
    }
}

function cleanText(aiResponse) {
    return {
        name: aiResponse.data.name,
        time: aiResponse.data.time,
        portions: aiResponse.data.portions,
        ingredients: aiResponse.data.ingredients ? aiResponse.data.ingredients.map(ingredient => ({
            ...ingredient,
            comment: ingredient.comment === null ? Prisma.JsonNull : ingredient.comment, // Handle null
        })) : [], // Fallback to empty array if ingredients is undefined
        instructions: aiResponse.data.instructions,
        final_comment: aiResponse.data.final_comment || '',
    };
}
