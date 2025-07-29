import express from 'express';
import { analyzeSymptoms } from '../controllers/symptomController.js';

const router = express.Router();

router.post('/analyze', analyzeSymptoms);

export default router;