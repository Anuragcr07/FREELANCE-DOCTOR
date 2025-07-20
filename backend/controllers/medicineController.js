const Medicine = require('../models/medicineModel');

// @desc    Add a new medicine
// @route   POST /api/inventory/add
// @access  Public
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

// @desc    Get all medicines
// @route   GET /api/inventory
// @access  Public
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({});
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Get low stock medicines
// @route   GET /api/inventory/low-stock
// @access  Public
const getLowStockMedicines = async (req, res) => {
  try {
    // Find medicines where quantity is less than or equal to minStock
    const lowStockMedicines = await Medicine.find({ $expr: { $lte: ['$quantity', '$minStock'] } });
    res.json(lowStockMedicines);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

module.exports = {
  addMedicine,
  getAllMedicines,
  getLowStockMedicines,
};