import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


export async function getAllIngredients() {
    const ingredients = await prisma.ingredient.findMany({
        select: {
            name: true,
        },
    });
    return ingredients.map(ingredient => ingredient.name);
}

export async function createIngredientFromRecipe(ingredients, recipeId){
    for (const ingredient in ingredients) {
        const name = ingredient.name;
        const ingredientId = await prisma.ingredient.create({
            data: {
                name
            },
            select: {
                id: true,
            },
        });
        await attachIngredientToRecipe(ingredient, recipeId, ingredientId);

    }
}

export async function attachIngredientToRecipe(ingredient, recipeId, ingredientId) {
    const { value, unit, comment } = ingredient;
    await prisma.recipeIngredient.create({
        data:{
            recipeId,
            ingredientId,
            value,
            unit,
            comment
        }
    });
}

