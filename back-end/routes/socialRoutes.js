
import express from 'express';
import {
  searchUsers,
  sendFollowRequest,
  unfollowUser,
  getFriends,
  getFriendsActivity,
  getUserProfile  
} from '../controllers/socialController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/search', searchUsers);
router.post('/follow', sendFollowRequest);
router.post('/unfollow', unfollowUser);
router.get('/friends', getFriends);
router.get('/activity', getFriendsActivity);
router.get('/profile/:userId', getUserProfile); 

export default router;
