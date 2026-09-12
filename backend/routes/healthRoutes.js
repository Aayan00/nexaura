import { Router } from 'express';
import { isDBConnected } from '../db.js';

const router = Router();

router.get('/health', (req, res) => {
  const dbStatus = isDBConnected();
  return res.json({
    success: true,
    message: 'Nexaura.exe backend is running',
    database: dbStatus,
  });
});

export default router;
