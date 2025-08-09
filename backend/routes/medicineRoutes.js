// routes/medicineRoutes.js
import express from 'express';
import {
  addMedicine,
  getAllMedicines,
  getLowStockMedicines,
  updateStockAfterBilling,
  searchMedicines,
  restockMedicine
} from '../controllers/medicineController.js';

const router = express.Router();

router.post('/add', addMedicine);
router.get('/', getAllMedicines);
router.get('/search', searchMedicines);
router.get('/low-stock', getLowStockMedicines);
router.patch('/update-stock', updateStockAfterBilling);
router.patch('/:id/restock', restockMedicine);

export default router;