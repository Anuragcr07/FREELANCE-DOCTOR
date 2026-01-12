import Transaction from '../models/transaction.model.js';
import Inventory from '../models/medicineModel.js';
import mongoose from 'mongoose';

export const getRevenueStats = async (req, res) => {
  try {
    // Convert string ID to MongoDB ObjectId for Aggregation
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // 1. Calculate user-specific revenue totals
    const todayResult = await Transaction.aggregate([
      { $match: { userId: userId, createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    
    const weekResult = await Transaction.aggregate([
      { $match: { userId: userId, createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const monthResult = await Transaction.aggregate([
      { $match: { userId: userId, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    // 2. Daily Trends (Last 7 days) for this specific user
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyTrends = await Transaction.aggregate([
      { $match: { userId: userId, createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          dailyTotal: { $sum: '$totalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Recent Transactions list
    const recentTransactions = await Transaction.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      todayRevenue: todayResult[0]?.total || 0,
      weekRevenue: weekResult[0]?.total || 0,
      monthRevenue: monthResult[0]?.total || 0,
      dailyTrends,
      recentTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching isolated stats', error: error.message });
  }
};

// Isolated Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalMedicines, lowStockCount, dailyRevenueResult, patientsServed] = await Promise.all([
      Inventory.countDocuments({ userId: userId }),
      Inventory.countDocuments({ userId: userId, quantity: { $lte: 10 } }),
      Transaction.aggregate([
        { $match: { userId: userId, createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Transaction.distinct("patientName", { userId: userId, createdAt: { $gte: today } })
    ]);

    res.status(200).json({
      totalMedicines,
      lowStockCount,
      todayRevenue: dailyRevenueResult[0]?.total || 0,
      patientsServed: patientsServed.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard sync error' });
  }
};