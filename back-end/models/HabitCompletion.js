// models/HabitCompletion.js
import mongoose from 'mongoose';

const habitCompletionSchema = new mongoose.Schema({
  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'missed', 'skipped'],
    required: true
  }
}, {
  timestamps: true
});

// Compound unique index: one completion per habit per day
habitCompletionSchema.index({ habitId: 1, date: 1 }, { unique: true });

export default mongoose.model('HabitCompletion', habitCompletionSchema);
