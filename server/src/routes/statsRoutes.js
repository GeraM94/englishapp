import { Router } from 'express';
import { handleStats } from '../controllers/statsController.js';

const router = Router();

router.get('/stats', handleStats);

export default router;
