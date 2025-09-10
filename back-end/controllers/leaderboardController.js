import User from '../models/User.js';
import Habit from '../models/Habit.js';

export const getLeaderboard = async (req, res) => {
  const users = await User.find({}).select('username email');

  const leaderboardData = await Promise.all(
    users.map(async (user) => {
      const habits = await Habit.find({ userId: user._id });

      const totalStreaks = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);
      const totalHabits = habits.length;

      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        totalStreaks,
        totalHabits,
        avgStreak: totalHabits > 0 ? totalStreaks / totalHabits : 0
      };
    })
  );

  const filteredData = leaderboardData
    .filter(user => user.totalHabits > 0)
    .sort((a, b) => b.avgStreak - a.avgStreak);

  res.json(filteredData);
};
