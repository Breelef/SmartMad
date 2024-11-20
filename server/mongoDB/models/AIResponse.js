import mongoose from 'mongoose';

const AIResponseSchema = new mongoose.Schema(
  {
    user_prompt_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPrompt', required: true },
    response: { type: mongoose.Schema.Types.Mixed, required: true }, // For JSON data
  },
  { timestamps: true }
);

const AIResponse = mongoose.model('AIResponse', AIResponseSchema);

export default AIResponse;