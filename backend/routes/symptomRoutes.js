import express from 'express';
import  { analyzeSymptoms } from '../controllers/symptomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route
router.post('/analyze', protect, analyzeSymptoms);

export default router;