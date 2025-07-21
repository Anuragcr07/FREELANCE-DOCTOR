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

medicineSchema.index({ medicineName: 1, manufacturer: 1, category: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);