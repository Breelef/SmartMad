import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function createInstructionsFromRecipe(instructions, recipeId) {
  for (const instruction of instructions) {
    const { part, steps } = instruction;

    const newInstruction = await prisma.instruction.create({
      data: {
        recipeId,
        part,
        steps,
      },
    });
  }
}