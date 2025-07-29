import Medicine from '../models/medicineModel.js';

export const addMedicine = async (req, res) => {
  try {
    const {
      medicineName,
      manufacturer,
      batchNumber,
      expiryDate,
      quantity,
      price,
      category,
      minStock
    } = req.body;

    const newMedicine = new Medicine({
      medicineName,
      manufacturer,
      batchNumber,
      expiryDate,
      quantity,
      price,
      category,
      minStock,
    });

    const savedMedicine = await newMedicine.save();
    res.status(201).json(savedMedicine);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const getLowStockMedicines = async (req, res) => {
  try {
    const lowStockMedicines = await Medicine.find({ $expr: { $lte: ['$quantity', '$minStock'] } });
    res.json(lowStockMedicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

/**
 * @desc    Update stock for multiple medicines after a bill is generated
 * @route   PATCH /api/medicines/update-stock
 * @access  Public (or Protected in a real app)
 */
export const updateStockAfterBilling = async (req, res) => {
  const { billItems } = req.body;

  if (!billItems || !Array.isArray(billItems) || billItems.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty bill items provided.' });
  }

  try {
    const bulkUpdateOperations = billItems.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $inc: { quantity: -item.quantity } },
      },
    }));

    const result = await Medicine.bulkWrite(bulkUpdateOperations);

    res.json({
      message: 'Stock updated successfully',
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error while updating stock', error });
  }
};