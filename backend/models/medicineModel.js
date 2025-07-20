const mongoose = require('mongoose');


const medicineSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  manufacturer: { type: String },
  batchNumber: { type: String },
  expiryDate: { type: Date },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  minStock: { type: Number, default: 10 },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Medicine', medicineSchema);