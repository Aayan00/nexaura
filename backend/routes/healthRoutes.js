import { Router } from 'express';
import { isDBConnected } from '../db.js';

const router = Router();

const sendHealth = (req, res) => {
  const dbStatus = isDBConnected();
  return res.status(200).json({
    success: true,
    message: 'Nexaura.exe backend is running',
    database: Boolean(dbStatus),
  });
};

router.get('/health', sendHealth);
router.get('/', sendHealth);

export default router;
