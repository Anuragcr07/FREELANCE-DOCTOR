import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import CriticalStockAlerts from '../components/CriticalStockAlerts';
import WeeklyRevenueChart from '../components/WeeklyRevenueChart';
import API from '../services/api'; // Corrected import
import { 
  Users, DollarSign, Package, Activity, 
  Plus, Pill, FileText, Loader2, AlertCircle, Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockCount: 0,
    todayRevenue: 0,
    patientsServed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Hitting /api/stats/dashboard via proxy
        const response = await API.get('/stats/dashboard');
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Dashboard sync error:", err);
        setError("Secure link interrupted. Check connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Establishing Secure Node</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {/* Status Message */}
          {error && (
            <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-[24px] flex items-center gap-3 text-orange-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Page Header & Quick Access */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Real-time Account Feed</p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white p-2 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-2 flex-wrap">
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} /> System
              </div>
              <div className="w-px h-6 bg-slate-100 mx-1 hidden sm:block" />
              
              <button onClick={() => navigate('/symptom-analysis')} className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <Activity size={16} className="text-emerald-500" /> Analyze
              </button>
              
              <button onClick={() => navigate('/billing')} className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                <FileText size={16} className="text-emerald-500" /> POS Bill
              </button>
              
              <button onClick={() => navigate('/inventory')} className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                <Plus size={16} /> New Entry
              </button>
            </div>
          </div>

          {/* User-Isolated Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard 
              title="Daily Traffic" 
              value={stats.patientsServed} 
              trend="Verified" 
              subtitle="Patients Assisted"
              icon={<Users size={20} />}
              color="emerald"
            />
            <StatCard 
              title="Live Earnings" 
              value={`₹${stats.todayRevenue.toLocaleString()}`} 
              trend="+12.5%" 
              subtitle="Current Revenue"
              icon={<DollarSign size={20} />}
              color="emerald"
            />
            <StatCard 
              title="Unique SKU" 
              value={stats.totalMedicines} 
              trend="Inventory" 
              subtitle="Total Products"
              icon={<Package size={20} />}
              color="emerald"
            />
            <StatCard 
              title="Alert Queue" 
              value={stats.lowStockCount} 
              trend="Urgent" 
              subtitle="Critical Levels"
              icon={<Activity size={20} />}
              color="orange"
            />
          </div>

          {/* Main Grid: Chart & Inventory Alerts */}
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