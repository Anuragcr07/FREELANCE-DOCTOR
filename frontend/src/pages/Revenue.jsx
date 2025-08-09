import React, { useState, useEffect } from 'react';
import { 
  FiBarChart2, 
  FiFileText, 
  FiArchive, 
  FiDollarSign, 
  FiHeart, 
  FiArrowUp, 
  FiCalendar,
  FiDownload,
  FiUser
} from 'react-icons/fi';
import Layout from '../components/Layout'; // Use the reusable Layout
import { Link } from 'react-router-dom';

// StatCard can be a separate component, but is included here for completeness
const StatCard = ({ title, value, change, icon }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm flex justify-between items-start">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      <div className="flex items-center mt-2 text-green-600">
        <FiArrowUp className="h-4 w-4" />
        <p className="text-sm font-semibold ml-1">{change}</p>
      </div>
    </div>
    <div className="text-slate-400">
      {React.cloneElement(icon, { className: 'h-8 w-8' })}
    </div>
  </div>
);


const Revenue = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://freelance-doctor-07.onrender.com/api/stats/revenue');
        if (!response.ok) {
          throw new Error('Failed to fetch revenue data. Please ensure the server is running.');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueStats();
  }, []);
  
  const getDayLabel = (dateString) => {
    const date = new Date(dateString + 'T00:00:00'); // Ensure date is parsed in the correct timezone
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (loading) return <Layout><div className="text-center p-8">Loading revenue data...</div></Layout>;
  if (error) return <Layout><div className="text-center p-8 text-red-500">{error}</div></Layout>;

  // Destructure after checking for stats to avoid errors on the initial render
  const { todayRevenue, weekRevenue, monthRevenue, dailyTrends, recentTransactions } = stats;
  const maxTrendValue = dailyTrends.length > 0 ? Math.max(...dailyTrends.map(d => d.dailyTotal)) : 1;

  return (
    <Layout>
      

        {/* Main Content */}
        <main className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Today's Revenue" value={`₹${todayRevenue.toFixed(2)}`} change="+25.0%" icon={<FiDollarSign />} />
                <StatCard title="This Week" value={`₹${weekRevenue.toFixed(2)}`} change="+14.2%" icon={<FiCalendar />} />
                <StatCard title="This Month" value={`₹${monthRevenue.toFixed(2)}`} change="+15.7%" icon={<FiFileText />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-slate-800">Daily Revenue Trends</h3>
                    <p className="text-slate-500 mb-6">Revenue overview for the last 7 days</p>
                    <div className="h-72 w-full">
                        <div className="h-64 flex items-end justify-between space-x-2">
                            {dailyTrends.map(trend => (
                                <div key={trend._id} className="w-full h-full flex flex-col justify-end items-center">
                                    <div 
                                        className="w-11/12 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors" 
                                        title={`Date: ${trend._id}\nRevenue: ₹${trend.dailyTotal.toFixed(2)}`} 
                                        style={{height: `${(trend.dailyTotal / maxTrendValue) * 100}%`}}>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="h-8 flex justify-between items-center border-t border-slate-200 mt-1">
                            {dailyTrends.map(trend => (
                                <div key={trend._id} className="w-full text-center">
                                    <p className="text-xs text-slate-500">{getDayLabel(trend._id)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
                            <p className="text-slate-500">Latest sales activity</p>
                        </div>
                       
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.map((trx) => (
                            <div key={trx._id} className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center">
                                    <div className="mr-4">
                                        <p className="font-semibold text-slate-800">{trx.items.length > 1 ? `${trx.items.length} Items` : trx.items[0].medicineName}</p>
                                        <p className="text-sm text-slate-500">{trx.patientName || 'Walk-in Customer'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-800">₹{trx.totalAmount.toFixed(2)}</p>
                                    <p className="text-sm text-slate-500">{new Date(trx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    </Layout>
  );
};

export default Revenue;