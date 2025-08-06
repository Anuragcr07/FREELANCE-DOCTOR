// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import medicineRoutes from './routes/medicineRoutes.js';
import symptomRoutes from './routes/symptomRoutes.js';
import patientRoutes from './routes/patients.js';
import transactionRoutes from './routes/transaction.routes.js';
import statsRoutes from './routes/stats.routes.js';



const app = express();


app.use(cors());
app.use(express.json());


app.use('/api/inventory', medicineRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in your .env file.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });