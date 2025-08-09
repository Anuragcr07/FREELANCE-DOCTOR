import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const WeeklyRevenueChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDayLabel = (dateString) => {
    const date = new Date(dateString + 'T00:00:00'); 
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://freelance-doctor-07.onrender.com/api/stats/revenue');
        if (!res.ok) throw new Error('Failed to fetch revenue data.');
        
        const data = await res.json();
        const formatted = data.dailyTrends.map(d => ({
          name: getDayLabel(d._id),
          revenue: d.dailyTotal
        }));
        setChartData(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-6 bg-white rounded-xl shadow-sm">Loading chart...</div>;
  if (error) return <div className="p-6 bg-white rounded-xl shadow-sm text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="font-bold text-xl text-gray-800">Weekly Revenue & Patient Trends</h3>
      <p className="text-sm text-gray-500 mb-4">
        Revenue and patient visit patterns over the last 7 days
      </p>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyRevenueChart;
