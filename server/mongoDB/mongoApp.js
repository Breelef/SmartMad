import express from 'express';
import modelService from './mongoService.js';

// Create a new router
const mongoRouter = express.Router();


mongoRouter.post('/ingredients', async (req, res) => {
  try {
    const ingredient = await modelService.createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoRouter.get('/ingredients', async (req, res) => {
  try {
    const ingredients = await modelService.getAllIngredients();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


mongoRouter.get('/recipes', async (req, res) => {
  try {
    const recipes = await modelService.getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoRouter.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await modelService.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoRouter.get('/recipeIngredients/:id', async (req, res) => {
  try {
    const ingredients = await modelService.getAllIngredientsForRecipe(req.params.id);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default mongoRouter;