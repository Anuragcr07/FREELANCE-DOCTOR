import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sale', 'stock_add', 'low_stock'], // Defines the possible activity types
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  details: { // A flexible field for values like "+100 units", "₹120", etc.
    type: String, 
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
  
const Activity = mongoose.model('Activity', activitySchema);

 export default Activity;