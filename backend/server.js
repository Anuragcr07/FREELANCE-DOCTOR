const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const medicineRoutes = require('./routes/medicineRoutes');
app.use('/api/inventory', medicineRoutes);

const masterMedicineRoutes = require('./routes/masterMedicineRoutes'); 

app.use('/api/inventory', medicineRoutes);
app.use('/api/medicines', masterMedicineRoutes);

const symptomRoutes = require('./routes/symptomRoutes');
app.use('/api/symptoms', symptomRoutes);
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