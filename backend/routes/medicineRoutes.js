// routes/medicineRoutes.js
const express = require('express');
const router = express.Router();
const { 
  addMedicine, 
  getAllMedicines, 
  getLowStockMedicines 
} = require('../controllers/medicineController');

// Define routes
router.post('/add', addMedicine);
router.get('/', getAllMedicines);
router.get('/low-stock', getLowStockMedicines);

module.exports = router;