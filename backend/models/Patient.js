// models/Patient.js
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    patientName: String,
    age: String,
    gender: String,
    symptoms: String,
    recommendedMedicines: Array,
    date: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;