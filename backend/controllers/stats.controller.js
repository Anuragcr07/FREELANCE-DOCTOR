import Transaction from '../models/transaction.model.js';
// You will likely need other models here for the full dashboard.
import Inventory from '../models/medicineModel.js'; 
import Activity from '../models/activity.model.js';


export const getRevenueStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
   
    const todayResult = await Transaction.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const todayRevenue = todayResult[0]?.total || 0;
   
    const weekResult = await Transaction.aggregate([
        { $match: { createdAt: { $gte: startOfWeek } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const weekRevenue = weekResult[0]?.total || 0;

    const monthResult = await Transaction.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const monthRevenue = monthResult[0]?.total || 0;
   
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dailyTrends = await Transaction.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          dailyTotal: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } }, 
    ]);
    
    const recentTransactions = await Transaction.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      todayRevenue,
      weekRevenue,
      monthRevenue,
      dailyTrends,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching stats.', error: error.message });
  }
};

// This is the dashboard function we created previously. It should also be in this file.
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalMedicines,
      lowStockCount,
      dailyRevenueResult,
      patientsServed,
      recentActivities
    ] = await Promise.all([
      Inventory.countDocuments(),
      Inventory.countDocuments({ quantity: { $lte: 10 } }),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Transaction.distinct("patientName", { createdAt: { $gte: today } }), // To count unique patients served today
      Activity.find().sort({ timestamp: -1 }).limit(5)
    ]);

    const dailyRevenue = dailyRevenueResult[0]?.total || 0;

    res.status(200).json({
      totalMedicines,
      lowStockCount,
      dailyRevenue,
      patientsServed: patientsServed.length, // Get the count of unique patients
      recentActivities
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching dashboard stats.', error: error.message });
  }
};