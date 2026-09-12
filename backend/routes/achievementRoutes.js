import { Router } from 'express';
import { achievementController } from '../controllers/achievementController.js';

const router = Router();

router.get('/', achievementController.getAchievements);
router.post('/:id/claim', achievementController.claimAchievement);

export default router;
