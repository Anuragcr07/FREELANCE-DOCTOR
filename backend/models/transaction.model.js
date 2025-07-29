import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  items: [
    {
      medicineId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory', 
        required: true,
      },
      medicineName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number, 
        required: true,
      },
    },
  ],

  patientName: {
    type: String,
    default: 'N/A',
  },
  phoneNumber: {
    type: String,
    default: 'N/A',
  },
  totalAmount: {
    type: Number,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;