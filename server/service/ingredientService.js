import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function createIngredientFromRecipe(ingredients, recipeId){
    for (const ingredient of ingredients) {
        const name = ingredient.name;
        const uniqueIngredient = await prisma.ingredient.findUnique( {where: { name }});
        if(uniqueIngredient){
            console.log("Unigue: ", uniqueIngredient)
            await attachIngredientToRecipe(ingredient, recipeId, uniqueIngredient.id);
        }else {
            const ingredientId = await prisma.ingredient.create({
                data: {
                    name
                },
                select: {
                    id: true,
                },
            });
            console.log("New: ", ingredientId.id);
            await attachIngredientToRecipe(ingredient, recipeId, ingredientId.id);
        }
    }
}

export async function attachIngredientToRecipe(ingredient, recipeId, ingredientId) {
    const { value, unit, comment } = ingredient;
    await prisma.recipeIngredient.create({
        data: {
            value,
            unit,
            comment,
            recipe: {
                connect: {
                    id: recipeId
                }
            },
            ingredient: {
                connect: {
                    id: ingredientId
                }
            }
        }
    });
}