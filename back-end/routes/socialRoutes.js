// routes/socialRoutes.js - Fixed imports
import express from 'express';
import {
  searchUsers,
  sendFollowRequest,
  unfollowUser,
  getFriends,
  getFriendsActivity,
  getUserProfile  // ← This should be getUserProfile, not getFriendProfile
} from '../controllers/socialController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/search', searchUsers);
router.post('/follow', sendFollowRequest);
router.post('/unfollow', unfollowUser);
router.get('/friends', getFriends);
router.get('/activity', getFriendsActivity);
router.get('/profile/:userId', getUserProfile); // ← Using getUserProfile

export default router;
