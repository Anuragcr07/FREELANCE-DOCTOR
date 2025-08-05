import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon, color, isActionCard = false }) => {
  if (isActionCard) {
    return (
        <div className={`${color} p-4 rounded-xl text-white shadow-md flex items-center cursor-pointer hover:opacity-90 transition-opacity`}>
            <div className='p-3 bg-black bg-opacity-20 rounded-lg mr-4'>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm opacity-90">{subtitle}</p>
            </div>
        </div>
    );
  }

  return (
    <div className={`${color} text-white p-6 rounded-xl shadow-lg flex flex-col justify-between`}>
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="text-3xl opacity-70">{icon}</div>
      </div>
      <div>
        <p className="text-4xl font-bold">{value}</p>
        <p className="text-sm opacity-90 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default DashboardCard;