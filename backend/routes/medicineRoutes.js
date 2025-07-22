// routes/medicineRoutes.js
const express = require('express');
const router = express.Router();

const { 
  addMedicine, 
  getAllMedicines, 
  getLowStockMedicines,
  updateStockAfterBilling
} = require('../controllers/medicineController');

router.post('/add', addMedicine);
router.get('/', getAllMedicines);
router.get('/low-stock', getLowStockMedicines);
router.patch('/update-stock', updateStockAfterBilling);

module.exports = router;