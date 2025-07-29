// backend/routes/masterMedicineRoutes.js
import express from 'express';
import { 
    searchMedicines, 
    addMasterMedicine, 
    getAllInventoryMedicines 
} from '../controllers/masterMedicineController.js';

const router = express.Router();

router.get('/all', getAllInventoryMedicines);
router.get('/search', searchMedicines);
router.post('/add', addMasterMedicine);

export default router;