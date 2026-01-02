import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, FileText, ArrowUpRight, 
  TrendingUp, Download, Loader2, ArrowRight,
  Clock, CheckCircle2, ShoppingBag
} from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard'; // Using our elite StatCard

const Revenue = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueStats = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/stats/revenue');
        if (!response.ok) throw new Error('System sync failed.');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        // Fallback Mock Data for UI design check
        setStats({
          todayRevenue: 1540.50,
          weekRevenue: 12450.00,
          monthRevenue: 45230.00,
          dailyTrends: [
            { _id: '2025-12-27', dailyTotal: 2100 },
            { _id: '2025-12-28', dailyTotal: 1800 },
            { _id: '2025-12-29', dailyTotal: 2800 },
            { _id: '2025-12-30', dailyTotal: 2400 },
            { _id: '2025-12-31', dailyTotal: 3100 },
            { _id: '2026-01-01', dailyTotal: 1900 },
            { _id: '2026-01-02', dailyTotal: 2600 },
          ],
          recentTransactions: [
            { _id: '1', items: [{}, {}], patientName: 'Sarah Jenkins', totalAmount: 450, createdAt: new Date() },
            { _id: '2', items: [{}], patientName: 'Michael Chen', totalAmount: 120, createdAt: new Date() },
            { _id: '3', items: [{}, {}, {}], patientName: 'Walk-in', totalAmount: 890, createdAt: new Date() },
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueStats();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compiling Ledger</p>
    </div>
  );

  const { todayRevenue, weekRevenue, monthRevenue, dailyTrends, recentTransactions } = stats;
  const maxTrendValue = Math.max(...dailyTrends.map(d => d.dailyTotal)) || 1;

  return (
    <Layout>
      <div className="p-8 max-w-[1500px] mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Revenue Insights</h1>
            <p className="text-slate-500 font-medium">Track your financial growth and daily sales trends.</p>
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

        {/* Top Bento Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Today's Revenue" 
            value={`₹${todayRevenue.toLocaleString()}`} 
            trend="+25.0%" 
            icon={<DollarSign size={20} />} 
            color="emerald"
          />
          <StatCard 
            title="Weekly Volume" 
            value={`₹${weekRevenue.toLocaleString()}`} 
            trend="+14.2%" 
            icon={<Calendar size={20} />} 
            color="emerald"
            subtitle="Current cycle"
          />
          <StatCard 
            title="Monthly Target" 
            value={`₹${monthRevenue.toLocaleString()}`} 
            trend="+15.7%" 
            icon={<FileText size={20} />} 
            color="emerald"
            subtitle="78% of goal reached"
          />
        </div>

        {/* Main Grid: Chart & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: Premium Bar Chart Card */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Daily Revenue Trends</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Last 7 Calendar Days</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-slate-600 uppercase">Growth Mode</span>
                    </div>
                </div>

                <div className="h-80 w-full flex items-end justify-between gap-4 px-2">
                    {dailyTrends.map(trend => (
                        <div key={trend._id} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                            {/* Value Tooltip on Hover */}
                            <div className="absolute bottom-[105%] opacity-0 group-hover:opacity-100 transition-all mb-2 pointer-events-none">
                                <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl">
                                    ₹{trend.dailyTotal.toLocaleString()}
                                </div>
                                <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                            </div>

                            {/* The Bar */}
                            <div className="w-full relative h-full flex flex-col justify-end">
                                <div 
                                    className="w-full bg-slate-50 rounded-2xl transition-all relative overflow-hidden group-hover:bg-emerald-50"
                                    style={{height: '100%'}} 
                                >
                                    <div 
                                        className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-2xl absolute bottom-0 transition-all duration-1000 group-hover:from-emerald-600 group-hover:to-teal-500 shadow-sm shadow-emerald-500/10"
                                        style={{height: `${(trend.dailyTotal / maxTrendValue) * 100}%`}}
                                    />
                                </div>
                            </div>
                            
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-4 group-hover:text-slate-900 transition-colors">
                                {new Date(trend._id + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* RIGHT: High-End Activity Feed */}
            <div className="lg:col-span-1 bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">Activity</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Latest Sales</p>
                    </div>
                    <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-500 transition-all">
                        <ArrowRight size={18} />
                    </button>
                </div>

                <div className="space-y-8">
                    {recentTransactions.map((trx, i) => (
                        <div key={trx._id} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                                    {trx.items.length > 1 ? <ShoppingBag size={20} /> : <CheckCircle2 size={20} />}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-800 text-sm truncate">
                                        {trx.items.length > 1 ? `${trx.items.length} Medicines` : 'Single Item Order'}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                        {trx.patientName || 'Anonymous'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-900 text-sm">₹{trx.totalAmount.toLocaleString()}</p>
                                <div className="flex items-center justify-end gap-1 text-[10px] text-slate-300 font-bold">
                                    <Clock size={10} /> {new Date(trx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50">
                    <button className="w-full py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                        Detailed Ledger
                    </button>
                </div>
            </div>

        </div>
      </div>
    </Layout>
  );
};

export default Revenue;