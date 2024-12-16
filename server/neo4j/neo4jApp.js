import express from 'express';
import graphService from './graphService';


const router = express.Router();
const prefixedRouter = express.Router();


router.post('/ingredients', async (req, res) => {
  try {
    const ingredient = await graphService.createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await graphService.getRecipeById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recipeIngredients/:id', async (req, res) => {
  try {
    const ingredients = await graphService.getAllIngredientsForRecipe(req.params.id);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


prefixedRouter.use('/graph', router);

export default prefixedRouter;
