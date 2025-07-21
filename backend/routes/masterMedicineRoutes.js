// backend/routes/masterMedicineRoutes.js
const express = require('express');
const router = express.Router();
const { searchMedicines, addMasterMedicine , getAllInventoryMedicines } = require('../controllers/masterMedicineController');

router.get('/all', getAllInventoryMedicines); // For fetching all medicines in inventory
// @route   GET /api/medicines/search
router.get('/search', searchMedicines);

// @route   POST /api/medicines/add
router.post('/add', addMasterMedicine); // For adding new medicines to DB

module.exports = router;