import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    chosenTense: { type: String, required: true },
    correctTense: { type: String, required: true },
    correct: { type: Boolean, required: true },
    tensesSelected: [{ type: String }],
    batchSeed: { type: String },
  },
  { timestamps: true }
);

const Attempt = mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);

export default Attempt;
