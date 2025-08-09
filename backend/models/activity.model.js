import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['sale', 'stock_add', 'low_stock'], 
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  details: { 
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