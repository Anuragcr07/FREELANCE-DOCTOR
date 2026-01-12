// controllers/transaction.controller.js
import Transaction from '../models/transaction.model.js';

export const createTransaction = async (req, res) => {
  try {
    const { items, totalAmount, patientName, phoneNumber } = req.body;

    // Check if user ID exists (if this is undefined, the DB will throw a Server Error)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User identity missing. Please re-login." });
    }

    const newTransaction = new Transaction({
      items,
      totalAmount,
      patientName,
      phoneNumber,
      // CRITICAL: You must manually assign the userId from the token here
      userId: req.user.id 
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("TRANSACTION ERROR:", error); // Check your VS Code terminal for this log
    res.status(500).json({ 
      message: 'Server error while creating transaction.', 
      error: error.message 
    });
  }
};