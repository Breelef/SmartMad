import express from 'express';
import modelService from './modelService';

const router = express.Router();

//Create single ingredient
router.post('/ingredients', async (req, res) => {
  try {
    const ingredient = await modelService.createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get single recipe by recipe id
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await modelService.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

//Get all ingredients for recipe by recipe id
router.get('/recipeIngredients/:id', async (req, res) => {
    const getIngredientsForRecipe = async (recipeId) => {
        try {
          const ingredients = await modelService.getAllIngredientsForRecipe(recipeId);
          console.log(ingredients);
        } catch (error) {
          console.error(error.message);
        }
      }
      getIngredientsForRecipe(req.params.id);
});