// backend/routes/masterMedicineRoutes.js
const express = require('express');
const router = express.Router();
const { searchMedicines, addMasterMedicine , getAllInventoryMedicines } = require('../controllers/masterMedicineController');

router.get('/all', getAllInventoryMedicines); 
router.get('/search', searchMedicines);

router.post('/add', addMasterMedicine); 

module.exports = router;