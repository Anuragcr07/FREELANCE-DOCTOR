import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, Info, BarChart2 } from 'lucide-react';
import API from '../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 p-4 shadow-2xl rounded-2xl border border-slate-800">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-white">₹{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const WeeklyRevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await API.get('/stats/revenue');
        const formatted = res.data.dailyTrends.map(d => ({
          name: new Date(d._id + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: d.dailyTotal
        }));
        setChartData(formatted);
      } catch (err) {
        console.error("Revenue sync failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-md h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h3 className="font-black text-xl text-slate-900 tracking-tight">Performance</h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
            7-Day Revenue Trends
          </p>
        </div>
        
        {chartData.length > 0 && (
          <div className="flex items-center gap-6 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
             <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                <span className="text-[11px] font-black text-slate-600 uppercase">Revenue</span>
             </div>
          </div>
        )}
      </div>

      <div style={{ width: '100%', height: 320 }} className="relative flex-1">
        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-500" />
           </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 800 }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 800 }} tickFormatter={(val) => `₹${val >= 1000 ? val / 1000 + 'k' : val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fill="url(#colorRevenue)" animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          /* ELITE EMPTY STATE */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100 animate-in fade-in duration-1000">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <BarChart2 className="text-slate-200" size={32} />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Transaction Data</p>
             <p className="text-xs text-slate-300 mt-1 font-medium text-center max-w-[200px]">
               Visual trends will populate here once sales are recorded in your account.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyRevenueChart;