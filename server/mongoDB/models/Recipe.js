import mongoose from 'mongoose';

const RecipeSchema = new mongoose.Schema(
  {
    ai_response_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResponse', required: true },
    name: { type: String, required: true },
    prep: { type: Number, required: true },
    cook: { type: Number, required: true },
    portion_size: { type: Number, required: true },
    final_comment: { type: String, required: true },
  },
  { timestamps: true }
);

// Virtuals for relationships
RecipeSchema.virtual('instructions', {
  ref: 'Instruction',
  localField: '_id',
  foreignField: 'recipe_id',
});

RecipeSchema.virtual('recipe_ingredients', {
  ref: 'RecipeIngredient',
  localField: '_id',
  foreignField: 'recipe_id',
});

RecipeSchema.virtual('modifications', {
  ref: 'RecipeModification',
  localField: '_id',
  foreignField: 'recipe_id',
});

RecipeSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'recipes',
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

export default Recipe;
