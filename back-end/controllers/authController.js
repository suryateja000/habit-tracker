// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    email: email.toLowerCase(),
    passwordHash,
    friends: []
  });

  const token = generateToken(user._id);

  res.status(201).json({
    message: 'Registration successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = await User.findOne({
    username: { $regex: new RegExp(`^${username}$`, 'i') }
  });

  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user._id);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { username, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { username, email: email?.toLowerCase() },
    { new: true, runValidators: true }
  ).select('-passwordHash');

  res.json({ message: 'Profile updated successfully', user });
};