import { Router } from 'express';
import { userController } from '../controllers/userController.js';

const router = Router();

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/stats/allocate', userController.allocateStat);
router.post('/allocate-stat', userController.allocateStat);
router.get('/heatmap', userController.getHeatmap);

export default router;
