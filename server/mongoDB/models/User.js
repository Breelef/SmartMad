import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Virtuals for relationships
UserSchema.virtual('prompts', {
  ref: 'UserPrompt',
  localField: '_id',
  foreignField: 'user_id',
});

UserSchema.virtual('recipes', {
  ref: 'Recipe',
  localField: '_id',
  foreignField: 'users',
});

const User = mongoose.model('User', UserSchema);

export default User;
