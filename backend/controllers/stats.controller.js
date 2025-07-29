import Transaction from '../models/transaction.model.js';


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