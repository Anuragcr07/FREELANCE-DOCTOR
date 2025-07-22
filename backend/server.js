const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());


const medicineRoutes = require('./routes/medicineRoutes');
app.use('/api/inventory', medicineRoutes); // This is correct

const masterMedicineRoutes = require('./routes/masterMedicineRoutes');
app.use('/api/medicines', masterMedicineRoutes); // This is also okay

const symptomRoutes = require('./routes/symptomRoutes');
app.use('/api/symptoms', symptomRoutes);

const patientRoutes = require('./routes/patients');
app.use('/api/patients', patientRoutes);

// COMMENT OUT OR DELETE THESE LINES TO FIX THE CRASH
// const billingRoutes = require('./routes/billingRoutes');
// app.use('/api/billing', billingRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});