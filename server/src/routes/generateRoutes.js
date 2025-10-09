import { Router } from 'express';
import { handleGenerate } from '../controllers/generateController.js';
import { handleAttempt } from '../controllers/attemptController.js';

const router = Router();

router.post('/generate', handleGenerate);
router.post('/attempt', handleAttempt);

export default router;
