import mongoose from 'mongoose';

const InstructionSchema = new mongoose.Schema(
  {
    recipe_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    part: { type: String, required: true },
    steps: { type: [String], required: true }, // Array of steps
  },
  { timestamps: true }
);

const Instruction = mongoose.model('Instruction', InstructionSchema);

export default Instruction;
