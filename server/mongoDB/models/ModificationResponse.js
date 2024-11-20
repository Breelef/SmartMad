import mongoose from 'mongoose';

const ModificationResponseSchema = new mongoose.Schema(
  {
    ai_response_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AIResponse', required: true },
    applied_to_recipe: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const ModificationResponse = mongoose.model('ModificationResponse', ModificationResponseSchema);

export default ModificationResponse;
