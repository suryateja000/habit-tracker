// controllers/habitController.js
import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';

export const getHabits = async (req, res) => {
  const habits = await Habit.find({ userId: req.user.id }).sort({ createdAt: -1 });

  const today = new Date().toISOString().split('T')[0];

  const habitsWithStatus = await Promise.all(habits.map(async (habit) => {
    const completion = await HabitCompletion.findOne({
      habitId: habit._id,
      date: today
    });

    return {
      ...habit.toObject(),
      completedToday: !!completion
    };
  }));

  res.json(habitsWithStatus);
};

export const createHabit = async (req, res) => {
  const { name, category = 'other', frequency = 'daily' } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Habit name is required' });
  }

  const existingHabit = await Habit.findOne({
    userId: req.user.id,
    name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
  });

  if (existingHabit) {
    return res.status(400).json({ error: 'Habit already exists' });
  }

  const habit = await Habit.create({
    name: name.trim(),
    userId: req.user.id,
    category,
    frequency,
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0
  });

  res.status(201).json({
    ...habit.toObject(),
    completedToday: false
  });
};

export const updateHabit = async (req, res) => {
  const { name, category, frequency } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Habit name is required' });
  }

  const habit = await Habit.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { name: name.trim(), category, frequency },
    { new: true, runValidators: true }
  );

  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  res.json(habit);
};

export const deleteHabit = async (req, res) => {
  const habit = await Habit.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  await HabitCompletion.deleteMany({ habitId: habit._id });

  res.json({ message: 'Habit deleted successfully' });
};

export const toggleHabitCompletion = async (req, res) => {
  const { id } = req.params;
  const today = new Date().toISOString().split('T')[0];

  const habit = await Habit.findOne({ _id: id, userId: req.user.id });
  if (!habit) {
    return res.status(404).json({ error: 'Habit not found' });
  }

  const existingCompletion = await HabitCompletion.findOne({
    habitId: id,
    date: today
  });

  let completed = false;

  if (existingCompletion) {
    await HabitCompletion.deleteOne({ _id: existingCompletion._id });
  } else {
    await HabitCompletion.create({
      habitId: id,
      userId: req.user.id,
      date: today,
      completed: true
    });
    completed = true;
  }

  await updateHabitStats(habit);

  res.json({
    habit: {
      ...habit.toObject(),
      completedToday: completed
    },
    completed
  });
};

async function updateHabitStats(habit) {
  const completions = await HabitCompletion.find({ habitId: habit._id }).sort({ date: -1 });

  habit.totalCompletions = completions.length;

  let currentStreak = 0;
  const today = new Date();

  for (let i = 0; i < completions.length; i++) {
    const completionDate = new Date(completions[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (completionDate.toDateString() === expectedDate.toDateString()) {
      currentStreak++;
    } else {
      break;
    }
  }

  habit.currentStreak = currentStreak;
  if (currentStreak > habit.longestStreak) {
    habit.longestStreak = currentStreak;
  }

  await habit.save();
}