// models/Patient.js
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientName: String,
    age: String,
    gender: String,
    symptoms: String,
    recommendedMedicines: Array,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);