// backend/models/masterMedicineModel.js
const mongoose = require('mongoose');

const masterMedicineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  genericName: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  indications: { type: String }, // What it's used for
  dosage: { type: String },
  sideEffects: { type: String },
  isRx: { type: Boolean, default: false }, // Is it a prescription drug?
  // You can add more fields like contraindications, storage instructions, etc.
});

// Create a text index on multiple fields for efficient searching
masterMedicineSchema.index({ 
  name: 'text', 
  genericName: 'text', 
  category: 'text',
  indications: 'text' 
});

module.exports = mongoose.model('MasterMedicine', masterMedicineSchema);