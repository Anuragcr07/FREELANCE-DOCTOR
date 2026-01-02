import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Custom Tooltip for that "Modern App" feel
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-xl border border-slate-100 rounded-2xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-lg font-extrabold text-slate-900">
          ₹{payload[0].value.toLocaleString()}
        </p>
        <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
          ↗ 12% increase
        </p>
      </div>
    );
  }
  return null;
};

const WeeklyRevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/stats/revenue');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        
        const formatted = data.dailyTrends.map(d => ({
          name: new Date(d._id + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: d.dailyTotal
        }));
        setChartData(formatted);
      } catch (err) {
        setError(err.message);
        // Fallback sample data for design preview
        setChartData([
          { name: 'Mon', revenue: 4000 },
          { name: 'Tue', revenue: 3000 },
          { name: 'Wed', revenue: 5000 },
          { name: 'Thu', revenue: 2780 },
          { name: 'Fri', revenue: 6890 },
          { name: 'Sat', revenue: 2390 },
          { name: 'Sun', revenue: 3490 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
      {/* Header with Legend */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h3 className="font-bold text-xl text-slate-900">Weekly Overview</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">
            Revenue & Patient Patterns
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-slate-600 uppercase">Revenue</span>
           </div>
           <div className="flex items-center gap-2 opacity-40">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-200" />
              <span className="text-[11px] font-bold text-slate-600 uppercase">Patients</span>
           </div>
        </div>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="8 8" 
              vertical={false} 
              stroke="#F1F5F9" 
            />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
              dy={15}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyRevenueChart;