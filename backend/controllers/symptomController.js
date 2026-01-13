import Medicine from '../models/medicineModel.js';

export const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length < 3) {
      return res.status(400).json({ message: 'Symptoms description is too short.' });
    }

    const keywords = symptoms
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2);

    const suggestedMedicines = await Medicine.find({
      userId: req.user.id, 
      $or: [
        { category: { $in: keywords.map(k => new RegExp(k, 'i')) } },
        { medicineName: { $in: keywords.map(k => new RegExp(k, 'i')) } }
      ]
    }).limit(10);

    res.status(200).json(suggestedMedicines);
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({ message: 'Analysis engine error', error: error.message });
  }
};