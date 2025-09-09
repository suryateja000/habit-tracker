import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import socialRoutes from './routes/socialRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

dotenv.config();

const app = express();

const startServer = async () => {
  await connectDB();

  const collections = await mongoose.connection.db.listCollections().toArray();

  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use((req, res, next) => {
    next();
  });

  app.use(express.json({
    limit: '10mb',
    verify: (req, res, buf) => {}
  }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/habits', habitRoutes);
  app.use('/api/social', socialRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);

  app.get('/api/health', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    const friendshipsCount = await mongoose.connection.db.collection('friendships').countDocuments();
    const usersCount = await mongoose.connection.db.collection('users').countDocuments();
    const habitsCount = await mongoose.connection.db.collection('habits').countDocuments();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        state: dbStateMap[dbState],
        connected: dbState === 1,
        name: mongoose.connection.db.databaseName
      },
      collections: {
        friendships: friendshipsCount,
        users: usersCount,
        habits: habitsCount
      },
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 5000
    });
  });

  app.get('/api', (req, res) => {
    res.json({
      message: 'Habit Tracker API is working!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/api/auth',
        habits: '/api/habits',
        social: '/api/social',
        leaderboard: '/api/leaderboard',
        health: '/api/health'
      }
    });
  });

  app.get('/api/debug/friendships', async (req, res) => {
    const friendshipsCollection = mongoose.connection.db.collection('friendships');
    const allFriendships = await friendshipsCollection.find({}).toArray();

    res.json({
      totalFriendships: allFriendships.length,
      friendships: allFriendships,
      databaseName: mongoose.connection.db.databaseName,
      timestamp: new Date().toISOString()
    });
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      error: err.message || 'Server error',
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Route not found',
      path: req.originalUrl,
      method: req.method,
      availableEndpoints: ['/api/auth', '/api/habits', '/api/social', '/api/leaderboard'],
      timestamp: new Date().toISOString()
    });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT);
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

startServer();