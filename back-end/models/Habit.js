// models/Habit.js
import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['health', 'productivity', 'learning', 'fitness', 'other'],
    default: 'other'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    default: 'daily'
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound unique index: one user can't have duplicate habit names
habitSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model('Habit', habitSchema);
