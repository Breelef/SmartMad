    import {PrismaClient} from '@prisma/client';
    import {getAiResponseFromId} from "./aiResponseService.js";
    import {createInstructionsFromRecipe} from "./instructionsService.js";
    import {createIngredientFromRecipe} from "./ingredientService.js";

    const prisma = new PrismaClient();

    export async function createRecipe(aiResponseId, recipeIndex){
        const response = await getAiResponseFromId(aiResponseId);
        
        // Explicit checks for invalid recipes BEFORE any destructuring
        if (!response.recipes || response.recipes.length <= recipeIndex) {
            throw new Error('Invalid recipe index');
        }
        
        const recipe = response.recipes[recipeIndex];
        const {name, prep, cook, portionSize, final_comment} = recipe;
        
        const createdRecipe = await prisma.recipe.create({
            data: {
                aiResponseId,
                name,
                prep,
                cook,
                portionSize,
                final_comment
            }
        });
        await createInstructionsFromRecipe(recipe.instructions || [], createdRecipe.id);
        await createIngredientFromRecipe(recipe.ingredients || [], createdRecipe.id);
        return prisma.recipe.findUnique({
            where: {id: createdRecipe.id},
            include: {
                instructions: true,
                ingredients: true,
            },
        });
    }