import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = '/api/inventory/low-stock'; 

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(API_URL);
        setAlerts(res.data);
      } catch (err) {
        console.error("Error fetching critical stock alerts:", err);
        setError("Failed to load alerts.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h3 className="font-bold text-xl text-gray-800">Critical Stock Alerts</h3>
        <p className="text-sm text-gray-500 mb-4">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h3 className="font-bold text-xl text-gray-800">Critical Stock Alerts</h3>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <h3 className="font-bold text-xl text-gray-800">Critical Stock Alerts</h3>
        <p className="text-sm text-gray-500">No critical alerts at the moment 🎉</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <h3 className="font-bold text-xl text-gray-800">Critical Stock Alerts</h3>
      <p className="text-sm text-gray-500 mb-4">Medicines requiring immediate attention</p>
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          // determine alert level based on stock ratio
          let level = 'low';
          if (alert.quantity <= alert.minStock * 0.25) level = 'critical';
          else if (alert.quantity <= alert.minStock * 0.5) level = 'high';
          else if (alert.quantity <= alert.minStock) level = 'medium';

          return (
            <div
              key={alert._id || index}
              className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-4 ${dotColors[level]}`}></span>
                <div>
                  <p className="font-semibold text-gray-900">{alert.medicineName}</p>
                  <p className="text-sm text-gray-500">
                    Current: {alert.quantity} / Min: {alert.minStock}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${levelColors[level]}`}>
                {level}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CriticalStockAlerts;
