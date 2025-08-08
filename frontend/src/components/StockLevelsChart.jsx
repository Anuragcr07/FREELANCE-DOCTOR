import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// In a real app, this data would come from your backend
const data = [
  { category: 'Pain Relief', 'Current Stock': 240, 'Low Stock Items': 15 },
  { category: 'Antibiotics', 'Current Stock': 180, 'Low Stock Items': 8 },
  { category: 'Cardiac', 'Current Stock': 90, 'Low Stock Items': 5 },
  { category: 'Diabetes', 'Current Stock': 320, 'Low Stock Items': 3 },
  { category: 'Others', 'Current Stock': 280, 'Low Stock Items': 20 },
];

const StockLevelsChart = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="font-bold text-xl text-gray-800">Stock Levels by Category</h3>
      <p className="text-sm text-gray-500 mb-4">Current stock vs low stock items per category</p>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" axisLine={false} tickLine={false}/>
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Current Stock" fill="#4A90E2" />
            <Bar dataKey="Low Stock Items" fill="#D0021B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockLevelsChart;