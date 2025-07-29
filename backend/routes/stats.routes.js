import express from 'express';
import { getRevenueStats } from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/revenue', getRevenueStats);

export default router;