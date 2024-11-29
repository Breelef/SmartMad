import { addRecipe } from '../service/recipeService.js';
import User from '../models/user.js';
import Recipe from '../models/recipe.js';

jest.mock('../models/user');
jest.mock('../models/recipe');

test('adds a recipe successfully', async () => {
  User.findByPk.mockResolvedValue({ id: 1 }); 
  Recipe.create.mockResolvedValue({ id: 10 });

  const recipeData = { data: { name: 'Test Recipe', time: { prep: { value: 10 }, cook: { value: 20 }, total: { value: 30 } }, portions: 4, final_comment: 'Delicious!' } };
  const recipeId = await addRecipe(1, recipeData);

  expect(recipeId).toBe(10);
  expect(Recipe.create).toHaveBeenCalled();
});