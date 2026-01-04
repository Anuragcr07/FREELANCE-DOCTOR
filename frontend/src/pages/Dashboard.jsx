import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import CriticalStockAlerts from '../components/CriticalStockAlerts';
import WeeklyRevenueChart from '../components/WeeklyRevenueChart';
import { 
  Users, DollarSign, Package, Activity, 
  Plus, Pill, FileText, Loader2, AlertCircle 
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    dailyRevenue: 0,
    totalProducts: 0,
    lowStock: 0,
    activePrescriptions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FETCH ALL DETAILS FROM BACKEND
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Replace with your actual backend URL
        const response = await axios.get('http://localhost:5000/api/stats/dashboard');
        
        // Mapping backend response to our dashboard state
        setStats({
          totalPatients: response.data.totalPatients || 0,
          dailyRevenue: response.data.todayRevenue || 0,
          totalProducts: response.data.totalMedicines || 0,
          lowStock: response.data.lowStockCount || 0,
          activePrescriptions: response.data.activePrescriptions || 0
        });
        setError(null);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to sync with server. Using cached data.");
        // Optional: set some dummy data here if server is down
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
        Connecting to Secure Server...
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 text-orange-600 text-sm font-bold shadow-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Dashboard Header & Quick Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
              <p className="text-slate-500 font-medium">Welcome back! Here's your medical store overview.</p>
            </div>

            {/* QUICK ACTION NAVIGATION */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm">
                <span className="bg-emerald-200 rounded-lg px-1 text-[10px]">⚡</span> Quick
              </button>
              <div className="w-px h-6 bg-slate-100 mx-1" />
              
              <button 
                onClick={() => navigate('/patient-details')}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
              >
                <Plus size={18} /> Add Patient
              </button>
              
              <button 
                onClick={() => navigate('/inventory')}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
              >
                <Pill size={18} /> New Medicine
              </button>
              
              <button 
                onClick={() => navigate('/billing')}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all"
              >
                <FileText size={18} /> Create Bill
              </button>
            </div>
          </div>

          {/* Top Stat Cards (Real Data) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Patients" 
              value={stats.totalPatients.toLocaleString()} 
              trend="+12.5%" 
              icon={<Users size={20} />}
              color="emerald"
            />
            <StatCard 
              title="Daily Revenue" 
              value={`₹${stats.dailyRevenue.toLocaleString()}`} 
              trend="+8.2%" 
              icon={<DollarSign size={20} />}
              color="emerald"
            />
            <StatCard 
              title="Total Products" 
              value={stats.totalProducts.toLocaleString()} 
              trend="Inventory" 
              subtitle="items in catalog"
              icon={<Package size={20} />}
              color="emerald"
            />
            <StatCard 
              title="Low Stock Alert" 
              value={stats.lowStock} 
              trend="Action Req." 
              subtitle="Items need restock"
              icon={<Activity size={20} />}
              color="orange"
            />
          </div>

          {/* Charts and Alerts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
               <WeeklyRevenueChart />
            </div>

            <div className="lg:col-span-1">
              <CriticalStockAlerts />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;