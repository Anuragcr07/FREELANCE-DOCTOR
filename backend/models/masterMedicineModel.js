// backend/models/masterMedicineModel.js
const mongoose = require('mongoose');

const masterMedicineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  genericName: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  indications: { type: String }, 
  dosage: { type: String },
  sideEffects: { type: String },
  isRx: { type: Boolean, default: false }, 
});

masterMedicineSchema.index({ 
  name: 'text', 
  genericName: 'text', 
  category: 'text',
  indications: 'text' 
});

module.exports = mongoose.model('MasterMedicine', masterMedicineSchema);