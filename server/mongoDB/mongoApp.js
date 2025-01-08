import express from 'express';
import modelService from './mongoService.js';

// Create a new router
const mongoRouter = express.Router();

/**
 * @swagger
 * /mongo/ingredients:
 *   post:
 *     summary: Create a new ingredient
 *     description: Creates a new ingredient in the MongoDB database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ingredient created successfully
 *       500:
 *         description: Internal server error
 */
mongoRouter.post('/ingredients', async (req, res) => {
  try {
    const ingredient = await modelService.createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mongo/ingredients:
 *   get:
 *     summary: Get all ingredients
 *     description: Retrieves all ingredients from the MongoDB database.
 *     responses:
 *       200:
 *         description: A list of ingredients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   quantity:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
mongoRouter.get('/ingredients', async (req, res) => {
  try {
    const ingredients = await modelService.getAllIngredients();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mongo/recipes:
 *   get:
 *     summary: Get all recipes
 *     description: Retrieves all recipes from the MongoDB database.
 *     responses:
 *       200:
 *         description: A list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   ingredients:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Internal server error
 */
mongoRouter.get('/recipes', async (req, res) => {
  try {
    const recipes = await modelService.getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mongo/recipes/{name}:
 *   get:
 *     summary: Get a recipe by name
 *     description: Retrieves a recipe by its name from the MongoDB database.
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: The name of the recipe
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single recipe
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
mongoRouter.get('/recipes/:name', async (req, res) => {
  try {
    const recipe = await modelService.getRecipeByName(req.params.name);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /mongo/recipeIngredients/{id}:
 *   get:
 *     summary: Get ingredients for a specific recipe
 *     description: Retrieves all ingredients for a given recipe ID from the MongoDB database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the recipe
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of ingredients for the recipe
 *       500:
 *         description: Internal server error
 */
mongoRouter.get('/recipeIngredients/:id', async (req, res) => {
  try {
    const ingredients = await modelService.getAllIngredientsForRecipe(req.params.id);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default mongoRouter;
