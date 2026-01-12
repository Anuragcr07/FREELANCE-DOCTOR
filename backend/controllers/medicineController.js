import Medicine from '../models/medicineModel.js';

// @desc    Add new medicine for specific user
export const addMedicine = async (req, res) => {
  try {
    const { medicineName, manufacturer, batchNumber, expiryDate, quantity, price, category, minStock } = req.body;

    const newMedicine = new Medicine({
      medicineName,
      manufacturer,
      batchNumber,
      expiryDate,
      quantity,
      price,
      category,
      minStock,
      userId: req.user.id // Tagging the data with the logged-in user
    });

    const savedMedicine = await newMedicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all medicines for the logged-in user only
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user.id });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get low stock medicines for current user
export const getLowStockMedicines = async (req, res) => {
  try {
    const lowStockMedicines = await Medicine.find({ 
      userId: req.user.id, // Filter by user
      $expr: { $lte: ['$quantity', '$minStock'] } 
    });
    res.json(lowStockMedicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update stock after billing (Only for user's own items)
export const updateStockAfterBilling = async (req, res) => {
  const { billItems } = req.body;

  if (!billItems || !Array.isArray(billItems) || billItems.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty bill items provided.' });
  }

  try {
    const bulkUpdateOperations = billItems.map(item => ({
      updateOne: {
        // Critical: filter by ID AND userId to prevent cross-user updates
        filter: { _id: item.id, userId: req.user.id },
        update: { $inc: { quantity: -item.quantity } },
      },
    }));

    const result = await Medicine.bulkWrite(bulkUpdateOperations);

    res.json({
      message: 'Stock updated successfully',
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Search user's medicines
export const searchMedicines = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: 'Search query required.' });

    const medicines = await Medicine.find({
      userId: req.user.id, // Filter by user
      medicineName: { $regex: query, $options: 'i' }
    });

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error during search', error: error.message });
  }
};

// @desc    Restock a single medicine (Only if owned by user)
export const restockMedicine = async (req, res) => {
  const { id } = req.params;
  const { quantityToAdd } = req.body;

  if (!quantityToAdd || quantityToAdd <= 0) {
    return res.status(400).json({ message: 'Invalid quantity.' });
  }

  try {
    const updatedMedicine = await Medicine.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // Security: Must match both
      { $inc: { quantity: quantityToAdd } },
      { new: true }
    );

    if (!updatedMedicine) {
      return res.status(404).json({ message: 'Medicine not found or access denied' });
    }

    res.json({ message: 'Restocked successfully', medicine: updatedMedicine });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};