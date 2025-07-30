const Activity = require('../models/activity.model');

const logActivity = async (type, message, details = '') => {
  try {
    await Activity.create({ type, message, details });
  } catch (error) {
    // Log the error but don't crash the main process
    console.error('Failed to log activity:', error.message);
  }
};

module.exports = logActivity;