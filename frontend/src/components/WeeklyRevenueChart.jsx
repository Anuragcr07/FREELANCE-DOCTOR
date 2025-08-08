import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// In a real app, this data would come from your backend
const data = [
  { name: 'Mon', revenue: 12000 },
  { name: 'Tue', revenue: 16000 },
  { name: 'Wed', revenue: 11200 },
  { name: 'Thu', revenue: 19000 },
  { name: 'Fri', revenue: 16500 },
  { name: 'Sat', revenue: 21500 },
  { name: 'Sun', revenue: 18000 },
];

const WeeklyRevenueChart = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="font-bold text-xl text-gray-800">Weekly Revenue & Patient Trends</h3>
      <p className="text-sm text-gray-500 mb-4">Revenue and patient visit patterns over the last 7 days</p>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyRevenueChart;