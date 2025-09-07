// routes/habitRoutes.js
import { Router } from 'express';
import { getUserHabits, createHabit, toggleHabitCompletion, deleteHabit } from '../controllers/habitController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getUserHabits);
router.post('/', createHabit);
router.patch('/:habitId/toggle', toggleHabitCompletion);
router.delete('/:habitId', deleteHabit);

export default router;
