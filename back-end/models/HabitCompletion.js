
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
    type: String, 
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});


habitCompletionSchema.index({ habitId: 1, date: 1 }, { unique: true });

export default mongoose.model('HabitCompletion', habitCompletionSchema);
