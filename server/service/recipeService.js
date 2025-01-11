    import {PrismaClient} from '@prisma/client';
    import {createInstructionsFromRecipe} from "./instructionsService.js";
    import {createIngredientFromRecipe} from "./ingredientService.js";

    const prisma = new PrismaClient();

    export async function createRecipe(responseId, recipe){
        const createdRecipe = await prisma.recipe.create({
            data: {
                aiResponseId: responseId,
                name: recipe.name,
                prep: recipe.time.prep,
                cook: recipe.time.cook,
                portionSize: recipe.portions,
                finalComment: recipe.final_comment,
            }
        });
        await createInstructionsFromRecipe(recipe.instructions || [], createdRecipe.id);
        await createIngredientFromRecipe(recipe.ingredients || [], createdRecipe.id);
        return prisma.recipe.findUnique({
              where: { id: createdRecipe.id },
              include: {
                instructions: true,
                recipeIngredients: {
                  include: {
                    ingredient: true,
                  },
                },
              },
        });
    }