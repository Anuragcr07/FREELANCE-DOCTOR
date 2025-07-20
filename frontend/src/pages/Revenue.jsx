import React from 'react';
import { 
  FiBarChart2, 
  FiFileText, 
  FiArchive, 
  FiDollarSign, 
  FiHeart, 
  FiArrowUp, 
  FiArrowDown,
  FiCalendar,
  FiDownload,
} from 'react-icons/fi';
import Header from '../components/Header'; // Assuming you have a Header component
import { useNavigate } from 'react-router-dom';

// Mock data for demonstration
const topMedicines = [
  { rank: 1, name: 'Paracetamol 500mg', sold: '1824 units sold', revenue: '₹45,600', change: '+12%', changeType: 'increase' },
  { rank: 2, name: 'Amoxicillin 250mg', sold: '760 units sold', revenue: '₹34,200', change: '+8%', changeType: 'increase' },
  { rank: 3, name: 'Insulin Glargine', sold: '35 units sold', revenue: '₹29,800', change: '-3%', changeType: 'decrease' },
  { rank: 4, name: 'Cetirizine 10mg', sold: '710 units sold', revenue: '₹28,400', change: '+15%', changeType: 'increase' },
  { rank: 5, name: 'Omeprazole 20mg', sold: '427 units sold', revenue: '₹25,600', change: '+6%', changeType: 'increase' },
];

const recentTransactions = [
    { time: '10:30 AM', name: 'Paracetamol 500mg', patient: 'Patient: John Doe', price: '₹50', qty: 2 },
    { time: '10:25 AM', name: 'Amoxicillin 250mg', patient: 'Patient: Jane Smith', price: '₹45', qty: 1 },
    { time: '10:20 AM', name: 'Insulin Glargine', patient: 'Patient: Bob Wilson', price: '₹850', qty: 1 },
    { time: '10:15 AM', name: 'Cetirizine 10mg', patient: 'Patient: Alice Brown', price: '₹40', qty: 1 },
    { time: '10:10 AM', name: 'Omeprazole 20mg', patient: 'Patient: Charlie Davis', price: '₹60', qty: 1 },
];

const Revenue = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-100 min-h-screen font-sans">
      {/* Header section can be refactored into a common Layout component */}
        <Header />
      {/* Navigation Tabs */}
      <nav className="px-4 pt-4">
        <div className="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2">
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/')}>
            <FiBarChart2 className="mr-2" /> Dashboard
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/symptom-analysis')}>
            <FiFileText className="mr-2" /> Symptom Analysis
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/inventory')}>
            <FiArchive className="mr-2" /> Inventory
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/revenue')}>
            <FiDollarSign className="mr-2" /> Revenue
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/medicine-db')}>
            <FiHeart className="mr-2" /> Medicine DB
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Revenue Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Today's Revenue" value="₹15,420" change="+25.0% from yesterday" icon={<FiDollarSign />} />
          <StatCard title="This Week" value="₹89,560" change="+14.2% from last week" icon={<FiCalendar />} />
          <StatCard title="This Month" value="₹345,600" change="+15.7% from last month" icon={<FiFileText />} />
        </div>

        {/* Revenue Trends, Top Medicines, and Recent Transactions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                 {/* Daily Revenue Trends */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="border-b border-slate-200 mb-4">
                        <div className="flex space-x-1">
                            <button className="px-4 py-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">Daily Revenue</button>
                            <button className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-blue-600">Monthly Trends</button>
                            <button className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-blue-600">Categories</button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Daily Revenue Trends (This Week)</h3>
                        <p className="text-slate-500 mb-6">Revenue and transaction count by day</p>
                        <div className="h-64 flex items-end justify-between space-x-2">
                          {/* Simplified static bar chart */}
                          <div className="w-full bg-blue-500 rounded-t-md" style={{height: '55%'}}></div>
                          <div className="w-full bg-blue-500 rounded-t-md" style={{height: '65%'}}></div>
                          <div className="w-full bg-blue-500 rounded-t-md" style={{height: '60%'}}></div>
                          <div className="w-full bg-blue-500 rounded-t-md" style={{height: '70%'}}></div>
                          <div className="w-full bg-blue-500 rounded-t-md" style={{height: '80%'}}></div>
                          <div className="w-full bg-blue-500 rounded-t-md" style={{height: '95%'}}></div>
                          <div className="w-full bg-blue-500 rounded-t-md" style={{height: '65%'}}></div>
                        </div>
                    </div>
                </section>
                {/* Top Performing Medicines */}
                <section className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Top Performing Medicines</h3>
                  <p className="text-slate-500 mb-6">Best selling medicines by revenue this month</p>
                  <div className="space-y-4">
                    {topMedicines.map((med) => (
                      <MedicinePerformanceItem key={med.rank} {...med} />
                    ))}
                  </div>
                </section>
            </div>
            
            {/* Recent Transactions */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
                        <p className="text-slate-500">Latest medicine sales transactions</p>
                    </div>
                    <button className="flex items-center px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200">
                        <FiDownload className="mr-2" /> Export
                    </button>
                </div>
                <div className="space-y-4">
                    {recentTransactions.map((trx, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div className="flex items-center">
                                <p className="text-sm font-medium text-slate-500 w-20">{trx.time}</p>
                                <div>
                                    <p className="font-semibold text-slate-800">{trx.name}</p>
                                    <p className="text-sm text-slate-500">{trx.patient}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-800">{trx.price}</p>
                                <p className="text-sm text-slate-500">Qty: {trx.qty}</p>
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

// Sub-components for cleaner structure
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
      {React.cloneElement(icon, { className: 'h-6 w-6' })}
    </div>
  </div>
);

const MedicinePerformanceItem = ({ rank, name, sold, revenue, change, changeType }) => (
  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
    <div className="flex items-center">
      <p className="text-slate-400 font-bold text-lg w-8">{rank}</p>
      <div>
        <p className="font-bold text-slate-800">{name}</p>
        <p className="text-sm text-slate-500">{sold}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <p className="font-bold text-lg text-slate-800">{revenue}</p>
      <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {change}
      </span>
    </div>
  </div>
);


export default Revenue;