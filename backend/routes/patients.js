
import express from 'express';
import Patient from '../models/Patient.js'; // You'll need a Patient model (schema)

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { patientName: { $regex: search, $options: 'i' } },
                    { 'recommendedMedicines.medicineName': { $regex: search, $options: 'i' } }
                ]
            };
        }
        const patients = await Patient.find(query);
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/add', async (req, res) => {
    const patient = new Patient({
        patientName: req.body.patientName,
        age: req.body.age,
        gender: req.body.gender,
        symptoms: req.body.symptoms,
        recommendedMedicines: req.body.recommendedMedicines,
    });

    try {
        const newPatient = await patient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;