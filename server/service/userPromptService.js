import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


export async function createPrompt(userId, prompt){
    try{
        return await prisma.userPrompt.create({
            data: {
                userId,
                prompt,
            },
            select: {
                id: true,
            },
        });
    }catch (e){
        console.error("Error creating UserPrompt:", e);
        return e;
    }
}