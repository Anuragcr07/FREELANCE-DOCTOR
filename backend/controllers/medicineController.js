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

module.exports = {
  addMedicine,
  getAllMedicines,
  getLowStockMedicines,
};