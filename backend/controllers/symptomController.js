const Inventory = require('../models/medicineModel');

const analyzeSymptoms = async (req, res) => {
    const { symptoms } = req.body;

    if (!symptoms) {
        return res.status(400).json({ message: 'Symptoms are required.' });
    }

    const keywords = symptoms.toLowerCase().split(/\s+/);

    try {
        const suggestedMedicines = await Inventory.find({
            $or: [
                { category: { $in: keywords.map(k => new RegExp(k, 'i')) } },
                { medicineName: { $in: keywords.map(k => new RegExp(k, 'i')) } }
            ]
        });

        res.json(suggestedMedicines);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    analyzeSymptoms,
};