import express from 'express';
import { getRevenueStats, getDashboardStats } from '../controllers/stats.controller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/revenue', protect, getRevenueStats);
router.get('/dashboard', protect, getDashboardStats);

export default router;