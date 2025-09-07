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
    type: String, // Store as YYYY-MM-DD format
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  }
  // Remove the 'status' field since we're using 'completed' instead
}, {
  timestamps: true
});

// Compound unique index: one completion per habit per day
habitCompletionSchema.index({ habitId: 1, date: 1 }, { unique: true });

export default mongoose.model('HabitCompletion', habitCompletionSchema);
