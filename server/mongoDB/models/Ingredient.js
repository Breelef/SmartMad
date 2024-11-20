import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

export default Ingredient;
