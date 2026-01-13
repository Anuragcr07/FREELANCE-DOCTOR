import express from 'express';
import Patient from '../models/Patient.js';
import { protect } from '../middleware/authMiddleware.js'; // Import your middleware

const router = express.Router();

// GET: Fetch only MY patients
router.get('/', protect, async (req, res) => {
    try {
        const { search } = req.query;
        let query = { userId: req.user.id }; // Filter by User ID
        
        if (search) {
            query.$or = [
                { patientName: { $regex: search, $options: 'i' } },
                { 'recommendedMedicines.medicineName': { $regex: search, $options: 'i' } }
            ];
        }
        const patients = await Patient.find(query).sort({ date: -1 });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST: Add patient with User ID link
router.post('/add', protect, async (req, res) => {
    const patient = new Patient({
        ...req.body,
        userId: req.user.id // Automatically link to logged-in user
    });

    try {
        const newPatient = await patient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;