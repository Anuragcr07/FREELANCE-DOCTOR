// routes/medicineRoutes.js
import express from 'express';
import {
  addMedicine,
  getAllMedicines,
  getLowStockMedicines,
  updateStockAfterBilling
} from '../controllers/medicineController.js';

const router = express.Router();

router.post('/add', addMedicine);
router.get('/', getAllMedicines);
router.get('/low-stock', getLowStockMedicines);
router.patch('/update-stock', updateStockAfterBilling);

export default router;