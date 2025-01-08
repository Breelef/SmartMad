import { Router } from "express";
import { getAllRecipes } from "../service/recipeService.js";
import { getAllIngredients } from "../service/ingredientService.js";

const sqlCrudRouter = Router();

/**
 * @swagger
 * /sql/ingredients:
 *   get:
 *     summary: Get all ingredients from SQL database
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
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
sqlCrudRouter.get("/ingredients", async (req, res) => {
    try {
        const ingredients = await getAllIngredients();
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /sql/recipes:
 *   get:
 *     summary: Get all recipes from SQL database
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
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   instructions:
 *                     type: string
 *       500:
 *         description: Internal server error
 */
sqlCrudRouter.get("/recipes", async (req, res) => {
    try {
        const recipes = await getAllRecipes();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default sqlCrudRouter;
