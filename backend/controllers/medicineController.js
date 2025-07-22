const Medicine = require('../models/medicineModel');

const addMedicine = async (req, res) => {
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

const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

const getLowStockMedicines = async (req, res) => {
  try {
    const lowStockMedicines = await Medicine.find({ $expr: { $lte: ['$quantity', '$minStock'] } });
    res.json(lowStockMedicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// NEW FUNCTION TO HANDLE STOCK UPDATES
/**
 * @desc    Update stock for multiple medicines after a bill is generated
 * @route   PATCH /api/medicines/update-stock
 * @access  Public (or Protected in a real app)
 */
const updateStockAfterBilling = async (req, res) => {
  // Get the array of items from the bill in the request body
  const { billItems } = req.body;

  // Basic validation
  if (!billItems || !Array.isArray(billItems) || billItems.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty bill items provided.' });
  }

  try {
    // Create an array of update operations for bulkWrite
    const bulkUpdateOperations = billItems.map(item => ({
      updateOne: {
        filter: { _id: item.id }, // Find the document by its ID
        // Use the $inc operator to decrement the quantity
        // This is an atomic operation and safer than fetching and then saving
        update: { $inc: { quantity: -item.quantity } },
      },
    }));

    // Execute all update operations in a single database command
    const result = await Medicine.bulkWrite(bulkUpdateOperations);

    res.json({
      message: 'Stock updated successfully',
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error while updating stock', error });
  }
};

module.exports = {
  addMedicine,
  getAllMedicines,
  getLowStockMedicines,
  updateStockAfterBilling, // <-- Export the new function
};