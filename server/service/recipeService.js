// recipeService.js
import User from "../models/user.js";
import Recipe from "../models/recipe.js";
import Ingredient from "../models/ingredient.js";
import Instruction from "../models/instruction.js";

// Add a recipe to the database
export async function addRecipe(userId, recipeData) {
  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Create the recipe
    const recipe = await Recipe.create({
      user_id: user.id,
      name: recipeData.data.name,
      prep_time: recipeData.data.time.prep.value,
      cook_time: recipeData.data.time.cook.value,
      total_time: recipeData.data.time.total.value,
      portions: recipeData.data.portions,
      final_comment: recipeData.data.final_comment,
    });

    return recipe.id; // Return the newly created recipe ID
  } catch (error) {
    console.error("Error adding recipe:", error);
    throw error;
  }
}

// Add ingredients to a specific recipe
export async function addIngredients(recipeId, ingredients) {
  try {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    // Insert ingredients for the recipe
    const ingredientPromises = ingredients.map((ingredient) =>
      Ingredient.create({
        recipe_id: recipe.id,
        name: ingredient.name,
        value: ingredient.value,
        unit: ingredient.unit,
        number: ingredient.number,
        comment: ingredient.comment,
      })
    );

    await Promise.all(ingredientPromises); // Wait for all ingredients to be added
  } catch (error) {
    console.error("Error adding ingredients:", error);
    throw error;
  }
}

// Add instructions to a specific recipe
export async function addInstructions(recipeId, instructions) {
  try {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    // Insert instructions for the recipe
    const instructionPromises = instructions.flatMap((instruction) =>
      instruction.steps.map((step) =>
        Instruction.create({
          recipe_id: recipe.id,
          part: instruction.part,
          step,
        })
      )
    );

    await Promise.all(instructionPromises); // Wait for all instructions to be added
  } catch (error) {
    console.error("Error adding instructions:", error);
    throw error;
  }
}
