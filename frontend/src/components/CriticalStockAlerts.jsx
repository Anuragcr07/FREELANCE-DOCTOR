import React from 'react';

// In a real app, this data would come from your backend
const alerts = [
  { name: 'Insulin', current: 5, min: 20, level: 'critical' },
  { name: 'Aspirin', current: 15, min: 50, level: 'medium' },
  { name: 'Amoxicillin', current: 25, min: 40, level: 'low' },
  { name: 'Paracetamol', current: 8, min: 30, level: 'high' },
];

const levelColors = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700',
};

const dotColors = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
};

const CriticalStockAlerts = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="font-bold text-xl text-gray-800">Critical Stock Alerts</h3>
      <p className="text-sm text-gray-500 mb-4">Medicines requiring immediate attention</p>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className={`w-3 h-3 rounded-full mr-4 ${dotColors[alert.level]}`}></span>
              <div>
                <p className="font-semibold text-gray-900">{alert.name}</p>
                <p className="text-sm text-gray-500">Current: {alert.current} / Min: {alert.min}</p>
              </div>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${levelColors[alert.level]}`}>
              {alert.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CriticalStockAlerts;