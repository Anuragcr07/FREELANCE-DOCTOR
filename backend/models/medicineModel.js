// models/Medicine.js
import mongoose from 'mongoose';

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

medicineSchema.index({ medicineName: 'text', category: 'text', manufacturer: 'text' });

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;