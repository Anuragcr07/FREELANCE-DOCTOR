// ✅ FIX: Ensure the model is imported correctly.
import Transaction from '../models/transaction.model.js';

// ✅ FIX: Export the function so it can be used in your routes.
export const createTransaction = async (req, res) => {
  try {
    const { items, totalAmount, patientName, phoneNumber } = req.body;

    if (!items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Missing required transaction data.' });
    }

    const newTransaction = new Transaction({
      items,
      totalAmount,
      patientName,
      phoneNumber,
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating transaction.', error: error.message });
  }
};