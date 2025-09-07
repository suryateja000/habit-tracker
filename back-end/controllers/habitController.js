// controllers/habitController.js
import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';
import mongoose from 'mongoose';

export const getUserHabits = async (req, res) => {
  try {
    
    const habits = await Habit.find({ userId: req.userId });
    const today = new Date().toISOString().split('T')[0];
    
    const habitsWithStatus = await Promise.all(
      habits.map(async (habit) => {
        const completion = await HabitCompletion.findOne({
          habitId: habit._id,
          date: today
        });
        
        return {
          ...habit.toObject(),
          completedToday: !!completion
        };
      })
    );

    res.json(habitsWithStatus);
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createHabit = async (req, res) => {
  const { name, category, frequency } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Habit name is required' });
  }
  
  const habit = new Habit({
    name: name.trim(),
    category: category || 'other',
    frequency: frequency || 'daily',
    userId: req.userId
  });
  await habit.save();
  res.status(201).json(habit);
};

export const toggleHabitCompletion = async (req, res) => {
  const { habitId } = req.params;
  const today = new Date().toISOString().split('T')[0];
  
  const habit = await Habit.findOne({ _id: habitId, userId: req.userId });
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  
  const existingCompletion = await HabitCompletion.findOne({ habitId, date: today });
  if (existingCompletion) {
    await HabitCompletion.deleteOne({ _id: existingCompletion._id });
    habit.currentStreak = Math.max(0, habit.currentStreak - 1);
    habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
    await habit.save();
    return res.json({ completed: false, habit });
  }
  
  const completion = new HabitCompletion({ habitId, userId: req.userId, date: today, completed: true });
  await completion.save();
  habit.currentStreak += 1;
  habit.totalCompletions += 1;
  habit.longestStreak = Math.max(habit.longestStreak, habit.currentStreak);
  await habit.save();
  return res.json({ completed: true, habit });
};

export const deleteHabit = async (req, res) => {
  const { habitId } = req.params;
  const habit = await Habit.findOneAndDelete({ _id: habitId, userId: req.userId });
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }
  await HabitCompletion.deleteMany({ habitId });
  res.json({ message: 'Habit deleted successfully' });
};
