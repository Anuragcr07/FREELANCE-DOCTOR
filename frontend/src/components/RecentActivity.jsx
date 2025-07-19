import React from 'react';
import { FiLink, FiPlusCircle, FiAlertTriangle } from 'react-icons/fi';

const RecentActivity = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <h2 className="text-lg font-semibold mb-1">Recent Activity</h2>
      <p className="text-sm text-gray-500 mb-4">Latest transactions and updates</p>
      <ul>
        <li className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-3">
          <div className="flex items-center">
            <FiLink className="text-blue-500 mr-3" />
            <div>
              <p>Paracetamol 500mg prescribed for fever</p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <p className="font-semibold">₹120</p>
        </li>
        <li className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-3">
          <div className="flex items-center">
            <FiPlusCircle className="text-green-500 mr-3" />
            <div>
              <p>New stock added: Amoxicillin 250mg</p>
              <p className="text-xs text-gray-500">15 minutes ago</p>
            </div>
          </div>
          <p className="text-green-600 font-semibold">+100 units</p>
        </li>
        <li className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center">
            <FiAlertTriangle className="text-red-500 mr-3" />
            <div>
              <p>Low stock alert: Insulin</p>
              <p className="text-xs text-gray-500">1 hour ago</p>
            </div>
          </div>
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            5 units left
          </div>
        </li>
      </ul>
    </div>
  );
};

export default RecentActivity;