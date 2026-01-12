import express from 'express';
import {
  addMedicine,
  getAllMedicines,
  getLowStockMedicines,
  updateStockAfterBilling,
  searchMedicines,
  restockMedicine
} from '../controllers/medicineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are now protected by the 'protect' middleware
router.post('/add', protect, addMedicine);
router.get('/', protect, getAllMedicines);
router.get('/search', protect, searchMedicines);
router.get('/low-stock', protect, getLowStockMedicines);
router.patch('/update-stock', protect, updateStockAfterBilling);
router.patch('/:id/restock', protect, restockMedicine);

export default router;