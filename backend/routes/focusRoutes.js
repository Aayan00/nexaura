import { Router } from 'express';
import { focusController } from '../controllers/focusController.js';

const router = Router();

router.get('/history', focusController.getHistory);
router.post('/complete', focusController.completeSession);

export default router;
