// routes/transaction.routes.js
import express from 'express';
import { createTransaction } from '../controllers/transaction.controller.js';
import { protect } from '../middleware/authMiddleware.js'; // Ensure path is correct

const router = express.Router();

// The 'protect' middleware MUST come before the controller
router.post('/', protect, createTransaction);

export default router;