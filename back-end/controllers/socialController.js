
import User from '../models/User.js';
import Friendship from '../models/Friendship.js';
import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';

export const searchUsers = async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Query must be at least 2 characters' });
  }

  const users = await User.find({
    $and: [
      { _id: { $ne: req.user.id } },
      {
        $or: [
          { username: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ]
      }
    ]
  }).select('username email').limit(10);

  res.json(users);
};

export const sendFollowRequest = async (req, res) => {
  const { recipientId } = req.body;
  const requesterId = req.user.id;

  const existingFriendship = await Friendship.findOne({
    $or: [
      { requester: requesterId, recipient: recipientId },
      { requester: recipientId, recipient: requesterId }
    ]
  });

  if (existingFriendship && existingFriendship.status === 'accepted') {
    return res.json({ message: 'Already friends', status: 'already_friends' });
  }

  const newFriendship = await Friendship.create({
    requester: requesterId,
    recipient: recipientId,
    status: 'accepted'
  });

  res.status(201).json({
    message: 'Friend request sent and accepted',
    friendship: newFriendship,
    status: 'new_friendship'
  });
};

export const unfollowUser = async (req, res) => {
  const { userId } = req.body;
  const currentUserId = req.user.id;

  await Friendship.deleteOne({
    $or: [
      { requester: currentUserId, recipient: userId },
      { requester: userId, recipient: currentUserId }
    ]
  });

  res.json({ message: 'User unfollowed successfully' });
};

export const getFriends = async (req, res) => {
  const friendships = await Friendship.find({
    $or: [
      { requester: req.user.id, status: 'accepted' },
      { recipient: req.user.id, status: 'accepted' }
    ]
  }).populate('requester recipient', 'username email');

  const friends = friendships.map(friendship => {
    return friendship.requester._id.toString() === req.user.id.toString()
      ? friendship.recipient
      : friendship.requester;
  });

  res.json(friends);
};

export const getFriendsActivity = async (req, res) => {
  const friendships = await Friendship.find({
    $or: [
      { requester: req.user.id, status: 'accepted' },
      { recipient: req.user.id, status: 'accepted' }
    ]
  });

  if (friendships.length === 0) {
    return res.json({ activities: [] });
  }

  const friendIds = friendships.map(friendship => {
    return friendship.requester._id.toString() === req.user.id.toString()
      ? friendship.recipient
      : friendship.requester;
  });

  const recentCompletions = await HabitCompletion.find({
    userId: { $in: friendIds }
  })
    .populate('userId', 'username')
    .populate('habitId', 'name category')
    .sort({ createdAt: -1 })
    .limit(20);

  const activities = recentCompletions.map(completion => ({
    _id: completion._id,
    user: completion.userId,
    habit: completion.habitId,
    completedAt: completion.date,
    createdAt: completion.createdAt
  }));

  res.json({ activities });
};

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const habits = await Habit.find({ userId });

  const friendship = await Friendship.findOne({
    $or: [
      { requester: req.user.id, recipient: userId, status: 'accepted' },
      { requester: userId, recipient: req.user.id, status: 'accepted' }
    ]
  });

  const isFollowing = !!friendship;

  res.json({
    user,
    habits,
    isFollowing
  });
};
