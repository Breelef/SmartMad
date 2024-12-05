import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function createInstructionsFromRecipe(instructions, recipeId){
    for (const instruction_part in instructions) {
        const { part, steps } = instruction_part;
        const newInstruction = await prisma.instruction.create({
            data:{
                recipeId,
                part,
                steps
            }
        });
    }
}