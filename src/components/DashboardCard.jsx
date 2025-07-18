import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className={`p-6 rounded-lg text-white ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs">{subtitle}</p>
        </div>
        <div className="text-2xl opacity-75">{icon}</div>
      </div>
    </div>
  );
};

export default DashboardCard;