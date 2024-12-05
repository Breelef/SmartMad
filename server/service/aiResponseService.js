import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function createAiResponseFromPrompt(promptId, aiResponse){
    try {
        return await prisma.aIResponse.create({
            data: {
                promptId,
                aiResponse,
            }
          });
    }catch (e){
        console.error("Error creating AiResponse:", e);
        return e;
    }
}

export async function getAiResponseFromId(responseId){
    try{
        return await prisma.aIResponse.findUnique({
           where: {
               id: responseId,
           },
        });
    }catch (e){
        console.error(`Error fetching AiResponse on Id: ${responseId}`, e);
        return e;
    }
}