import { Router } from 'express';
import { shopController } from '../controllers/shopController.js';

const router = Router();

router.get('/items', shopController.getItems);
router.post('/buy', shopController.buyItem);
router.post('/purchase/:id', shopController.buyItem);
router.post('/equip/:id', shopController.equipItem);
router.post('/equip', shopController.equipItem);

export default router;
