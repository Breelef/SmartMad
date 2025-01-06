import express from 'express';
import graphService from './graphService.js';


const neo4jRouter = express.Router();

neo4jRouter.get('/ingredients', async (req, res) => {
  try {
    const ingredients = await graphService.getAllIngredients();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

neo4jRouter.get('/recipes', async (req, res) => {
  try {
    const recipes = await graphService.getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

neo4jRouter.post('/ingredients', async (req, res) => {
  try {
    const ingredient = await graphService.createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

neo4jRouter.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await graphService.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

neo4jRouter.get('/recipeIngredients/:id', async (req, res) => {
  try {
    const ingredients = await graphService.getAllIngredientsForRecipe(req.params.id);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//const neo4jRouter = express.Router();
//neo4jRouter.use('/graph', router);

export default neo4jRouter;