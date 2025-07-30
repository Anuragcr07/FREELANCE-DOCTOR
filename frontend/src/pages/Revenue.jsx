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
  FiLink
} from 'react-icons/fi';
import Header from '../components/Header'; 
import { useNavigate } from 'react-router-dom';

const Revenue = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/stats/revenue');
        if (!response.ok) {
          throw new Error('Failed to fetch revenue data.');
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

  if (loading) return <div className="p-8 text-center text-lg">Loading revenue data...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-500">Error: {error}</div>;

  const { todayRevenue, weekRevenue, monthRevenue, dailyTrends, recentTransactions } = stats;
  
  // Calculate max height for the bar chart for scaling. Ensure it's not zero.
  const maxTrendValue = dailyTrends.length > 0 ? Math.max(...dailyTrends.map(d => d.dailyTotal)) : 1;

  // Helper to format date strings correctly, avoiding timezone issues.
  const getDayLabel = (dateString) => {
    // Adding T00:00:00 ensures the date is interpreted in local time, not UTC.
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans">
        <Header />
      
      {/* Navigation Tabs */}
      <nav className="px-4 pt-4">
        {/* ✅ RESPONSIVE FIX: Added overflow-x-auto to make nav scrollable on small screens */}
        <div className="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2 overflow-x-auto">
            {/* ✅ RESPONSIVE FIX: Added whitespace-nowrap and flex-shrink-0 to prevent buttons from breaking */}
            <button className="flex items-center justify-center flex-shrink-0 whitespace-nowrap px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/')}><FiBarChart2 className="mr-2" /> Dashboard</button>
            <button className="flex items-center justify-center flex-shrink-0 whitespace-nowrap px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/symptom-analysis')}><FiFileText className="mr-2" /> Symptom Analysis</button>
            <button className="flex items-center justify-center flex-shrink-0 whitespace-nowrap px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/inventory')}><FiArchive className="mr-2" /> Inventory</button>
            <button className="flex items-center justify-center flex-shrink-0 whitespace-nowrap px-4 py-2 text-white bg-slate-800 rounded-md" onClick={() => navigate('/revenue')}><FiDollarSign className="mr-2" /> Revenue</button>
            <button className="flex items-center justify-center flex-shrink-0 whitespace-nowrap px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/medicine-db')}><FiHeart className="mr-2" /> Medicine DB</button>
            <button className="flex items-center justify-center flex-shrink-0 whitespace-nowrap px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/patient-details')}><FiLink className="mr-2" /> Patient Details</button>
            <button className="flex items-center justify-center flex-shrink-0 whitespace-nowrap px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/billing')}><FiDollarSign className="mr-2" /> Billing</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* ✅ This section is already responsive: 1 column on mobile, 3 on desktop. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Today's Revenue" value={`₹${todayRevenue.toFixed(2)}`} change="+25.0% from yesterday" icon={<FiDollarSign />} />
          <StatCard title="This Week" value={`₹${weekRevenue.toFixed(2)}`} change="+14.2% from last week" icon={<FiCalendar />} />
          <StatCard title="This Month" value={`₹${monthRevenue.toFixed(2)}`} change="+15.7% from last month" icon={<FiFileText />} />
        </div>

        {/* ✅ This section is also responsive: 1 column on mobile, 3 on large screens. */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="border-b border-slate-200 mb-4">
                        <div className="flex space-x-1">
                            <button className="px-4 py-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">Daily Revenue</button>
                            <button className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-blue-600">Monthly Trends</button>
                            <button className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-blue-600">Categories</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Daily Revenue Trends (Last 7 Days)</h3>
                        <p className="text-slate-500 mb-6">Revenue count by day</p>
                        {/* ✅ RESPONSIVE FIX: Chart container with labels */}
                        <div className="h-72 w-full">
                            <div className="h-64 flex items-end justify-between space-x-2">
                                {dailyTrends.map(trend => (
                                    <div key={trend._id} className="w-full h-full flex flex-col justify-end items-center">
                                        <div 
                                            className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors" 
                                            title={`Date: ${trend._id}\nRevenue: ₹${trend.dailyTotal.toFixed(2)}`} 
                                            style={{height: `${(trend.dailyTotal / maxTrendValue) * 100}%`}}>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-8 flex justify-between items-center -mx-1">
                                {dailyTrends.map(trend => (
                                    <div key={trend._id} className="w-full text-center">
                                        <p className="text-xs text-slate-500">{getDayLabel(trend._id)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                {/* You can add back the "Top Performing Medicines" section with new backend logic if needed */}
            </div>
            
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
                 {/* ✅ RESPONSIVE FIX: Header stacks vertically on small screens */}
                <div className="flex flex-col items-start gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
                        <p className="text-slate-500">Latest medicine sales transactions</p>
                    </div>
                    <button className="flex items-center px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 flex-shrink-0">
                        <FiDownload className="mr-2" /> Export
                    </button>
                </div>
                <div className="space-y-4">
                    {recentTransactions.map((trx) => (
                        // ✅ RESPONSIVE FIX: Transaction items stack on small screens for readability
                        <div key={trx._id} className="flex flex-col items-start gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center">
                                <p className="text-sm font-medium text-slate-500 w-20">{new Date(trx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <div>
                                    <p className="font-semibold text-slate-800">{trx.items.length > 1 ? `${trx.items.length} Items` : trx.items[0].medicineName}</p>
                                    <p className="text-sm text-slate-500">Patient: {trx.patientName}</p>
                                </div>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                                <p className="font-bold text-slate-800">₹{trx.totalAmount.toFixed(2)}</p>
                                <p className="text-sm text-slate-500">{trx.items.reduce((acc, item) => acc + item.quantity, 0)} Qty</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

// StatCard component - This is already implicitly responsive due to the grid layout.
const StatCard = ({ title, value, change, icon }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm flex justify-between items-start">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
      {/* This 'change' value is hardcoded, can be made dynamic later */}
      <div className="flex items-center mt-2 text-green-600">
        <FiArrowUp className="h-4 w-4" />
        <p className="text-sm font-semibold ml-1">{change}</p>
      </div>
    </div>
    <div className="text-slate-400">
      {React.cloneElement(icon, { className: 'h-6 w-6' })}
    </div>
  </div>
);

export default Revenue;