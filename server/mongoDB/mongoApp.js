import express from 'express';
import modelService from './modelService';

// Create a new router
const router = express.Router();
const prefixedRouter = express.Router();

// Define your routes
router.post('/ingredients', async (req, res) => {
  try {
    const ingredient = await modelService.createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await modelService.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recipeIngredients/:id', async (req, res) => {
  try {
    const ingredients = await modelService.getAllIngredientsForRecipe(req.params.id);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


prefixedRouter.use('/mongo', router);

export default prefixedRouter;