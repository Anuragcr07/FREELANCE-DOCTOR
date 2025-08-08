import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon, trend, colorClass }) => {
  return (
    <div className={`p-5 rounded-xl shadow-sm flex flex-col justify-between ${colorClass}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="text-2xl text-gray-600">{icon}</div>
      </div>
      <div>
        <p className="text-4xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center text-sm text-gray-600 mt-1">
            {trend && <span className="mr-2">{trend.icon}</span>}
            <span>{subtitle}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;