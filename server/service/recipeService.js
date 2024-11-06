// recipeService.js
import pool from '../database/database.js';

// Insert a recipe into the database
export async function addRecipe(userId, recipeData) {
    const [result] = await pool.query(
        `INSERT INTO recipes (user_id, name, prep_time, cook_time, total_time, portions, final_comment)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            recipeData.name,
            recipeData.time.prep.value,
            recipeData.time.cook.value,
            recipeData.time.total.value,
            recipeData.portions,
            recipeData.final_comment
        ]
    );
    return result.insertId; // Returns the new recipe ID
}

// Insert ingredients for a specific recipe
export async function addIngredients(recipeId, ingredients) {
    const queries = ingredients.map((ingredient) =>
        pool.query(
            `INSERT INTO ingredients (recipe_id, name, value, unit, number, comment)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                recipeId,
                ingredient.name,
                ingredient.value,
                ingredient.unit,
                ingredient.number,
                ingredient.comment
            ]
        )
    );
    await Promise.all(queries); // Run all ingredient inserts in parallel
}

// Insert instructions for a specific recipe
export async function addInstructions(recipeId, instructions) {
    const queries = instructions.flatMap((instruction) =>
        instruction.steps.map((step) =>
            pool.query(
                `INSERT INTO instructions (recipe_id, part, step)
                 VALUES (?, ?, ?)`,
                [recipeId, instruction.part, step]
            )
        )
    );
    await Promise.all(queries); // Run all instruction inserts in parallel
}
