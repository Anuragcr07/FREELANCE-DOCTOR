import express from 'express';
import { getRevenueStats , getDashboardStats} from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/revenue', getRevenueStats);
router.get('/dashboard', getDashboardStats);

export default router;