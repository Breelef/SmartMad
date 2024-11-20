import mongoose from 'mongoose';

const UserPromptSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: { type: mongoose.Schema.Types.Mixed, required: true }, // JSON-like structure
  },
  { timestamps: true }
);

// Virtuals for relationships
UserPromptSchema.virtual('aiResponse', {
  ref: 'AIResponse',
  localField: '_id',
  foreignField: 'user_prompt_id',
  justOne: true, // Since it's a one-to-one relationship
});

UserPromptSchema.virtual('modifications', {
  ref: 'RecipeModification',
  localField: '_id',
  foreignField: 'user_prompt_id',
});

const UserPrompt = mongoose.model('UserPrompt', UserPromptSchema);

export default UserPrompt;
