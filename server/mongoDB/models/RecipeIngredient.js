import mongoose from 'mongoose';

const RecipeIngredientSchema = new mongoose.Schema(
  {
    recipe_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    ingredient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

const RecipeIngredient = mongoose.model('RecipeIngredient', RecipeIngredientSchema);

export default RecipeIngredient;
