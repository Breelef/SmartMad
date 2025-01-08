import express from 'express';
import graphService from './graphService.js';

// Create a new router
const neo4jRouter = express.Router();

/**
 * @swagger
 * /neo4j/ingredients:
 *   get:
 *     summary: Get all ingredients from Neo4j
 *     description: Retrieves all ingredients from the Neo4j database.
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
neo4jRouter.get('/ingredients', async (req, res) => {
  try {
    const ingredients = await graphService.getAllIngredients();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /neo4j/recipes:
 *   get:
 *     summary: Get all recipes from Neo4j
 *     description: Retrieves all recipes from the Neo4j database.
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
neo4jRouter.get('/recipes', async (req, res) => {
  try {
    const recipes = await graphService.getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /neo4j/ingredients:
 *   post:
 *     summary: Create a new ingredient in Neo4j
 *     description: Creates a new ingredient in the Neo4j database.
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
 *         description: Ingredient created
 *       500:
 *         description: Internal server error
 */
neo4jRouter.post('/ingredients', async (req, res) => {
  try {
    const ingredient = await graphService.createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /neo4j/recipes/{name}:
 *   get:
 *     summary: Get a recipe by name from Neo4j
 *     description: Retrieves a recipe by its ID from the Neo4j database.
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: The name of the recipe
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recipe details
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Internal server error
 */
neo4jRouter.get('/recipes/:name', async (req, res) => {
  try {
    const recipe = await graphService.getRecipeByName(req.params.name);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /neo4j/recipeIngredients/{id}:
 *   get:
 *     summary: Get all ingredients for a recipe from Neo4j
 *     description: Retrieves all ingredients for a given recipe ID from Neo4j.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the recipe
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of ingredients
 *       500:
 *         description: Internal server error
 */
neo4jRouter.get('/recipeIngredients/:id', async (req, res) => {
  try {
    const ingredients = await graphService.getAllIngredientsForRecipe(req.params.id);
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default neo4jRouter;
