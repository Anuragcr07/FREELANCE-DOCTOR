import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, FileText, TrendingUp, 
  Download, Loader2, ArrowRight, Clock, 
  CheckCircle2, ShoppingBag, AlertTriangle, BarChart3
} from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import API from '../services/api'; 

const Revenue = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueStats();
  }, []);

  const fetchRevenueStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetches user-isolated revenue data using JWT token
      const response = await API.get('/stats/revenue');
      setStats(response.data);
    } catch (err) {
      console.error("Revenue Fetch Error:", err);
      setError("Unable to sync financial data. Please re-login.");
      
      // Fallback Sample Data for design preview if backend is disconnected
      setStats({
        todayRevenue: 0,
        weekRevenue: 0,
        monthRevenue: 0,
        dailyTrends: [],
        recentTransactions: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Compiling Financial Ledger</p>
    </div>
  );

  const { todayRevenue, weekRevenue, monthRevenue, dailyTrends, recentTransactions } = stats;
  
  // Calculate max value for bar chart scaling
  const maxTrendValue = dailyTrends?.length > 0 
    ? Math.max(...dailyTrends.map(d => d.dailyTotal)) 
    : 1000;

  return (
    <Layout>
      <div className="p-8 max-w-[1500px] mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <BarChart3 size={22} />
               </div>
               Revenue Insights
            </h1>
            <p className="text-slate-500 font-medium mt-2">Analytical overview of your store's economic growth.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                <Download size={18} /> Export PDF
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all">
                <TrendingUp size={18} /> Forecast
            </button>
          </div>
        </div>

        {error && (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 text-orange-700 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <AlertTriangle size={18} /> {error}
            </div>
        )}

        {/* Top High-Contrast Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Today's Earnings" 
            value={`₹${todayRevenue?.toLocaleString() || '0'}`} 
            trend="+25.0%" 
            icon={<DollarSign size={20} />} 
            color="emerald"
          />
          <StatCard 
            title="Weekly Volume" 
            value={`₹${weekRevenue?.toLocaleString() || '0'}`} 
            trend="Isolated" 
            icon={<Calendar size={20} />} 
            color="emerald"
            subtitle="Current cycle"
          />
          <StatCard 
            title="Monthly Total" 
            value={`₹${monthRevenue?.toLocaleString() || '0'}`} 
            trend="Synced" 
            icon={<FileText size={20} />} 
            color="emerald"
            subtitle="Secure Ledger"
          />
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: Premium Custom Bar Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg tracking-tight">Performance Trend</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">7-Day Transaction History</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-600 uppercase">Live Metrics</span>
                    </div>
                </div>

                <div className="h-80 w-full flex items-end justify-between gap-4 px-2">
                    {dailyTrends?.length > 0 ? dailyTrends.map(trend => (
                        <div key={trend._id} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                            {/* Detailed Hover Tooltip */}
                            <div className="absolute bottom-[105%] opacity-0 group-hover:opacity-100 transition-all mb-2 pointer-events-none z-20">
                                <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-xl shadow-2xl">
                                    ₹{trend.dailyTotal.toLocaleString()}
                                </div>
                                <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                            </div>

                            <div className="w-full relative h-full flex flex-col justify-end">
                                <div className="w-full bg-slate-50 rounded-[20px] transition-all relative overflow-hidden h-full group-hover:bg-emerald-50/50">
                                    <div 
                                        className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-[20px] rounded-b-[4px] absolute bottom-0 transition-all duration-1000 group-hover:from-emerald-600 group-hover:to-teal-500 shadow-sm shadow-emerald-500/10"
                                        style={{height: `${(trend.dailyTotal / maxTrendValue) * 100}%`}}
                                    />
                                </div>
                            </div>
                            
                            <p className="text-[10px] font-black text-slate-400 uppercase mt-5 group-hover:text-slate-900 transition-colors">
                                {new Date(trend._id + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                        </div>
                    )) : (
                        <div className="w-full h-full flex flex-col items-center justify-center opacity-20 italic text-slate-400 font-bold">
                            No historical data found in this account
                        </div>
                    )}
                </div>
            </div>
            
            {/* RIGHT: Transaction Activity Feed */}
            <div className="lg:col-span-1 bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg tracking-tight">Recent Sales</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Terminal Activity</p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 transition-all">
                        <ArrowRight size={16} />
                    </button>
                </div>

                <div className="space-y-8 min-h-[400px]">
                    {recentTransactions?.length > 0 ? recentTransactions.map((trx) => (
                        <div key={trx._id} className="flex items-center justify-between group cursor-pointer animate-in fade-in slide-in-from-right-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                                    {trx.items.length > 1 ? <ShoppingBag size={22} /> : <CheckCircle2 size={22} />}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-800 text-sm truncate group-hover:text-emerald-700 transition-colors">
                                        {trx.patientName || 'Anonymous Order'}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock size={10} className="text-slate-300" />
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                            {new Date(trx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-900 text-sm">₹{trx.totalAmount?.toLocaleString()}</p>
                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Paid</p>
                            </div>
                        </div>
                    )) : (
                        <div className="h-64 flex flex-col items-center justify-center opacity-30">
                            <FileText size={40} className="mb-4 text-slate-200" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Recent Sales</p>
                        </div>
                    )}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50">
                    <button className="w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.25em] rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                        Detailed Ledger View
                    </button>
                </div>
            </div>

        </div>
      </div>
    </Layout>
  );
};

export default Revenue;