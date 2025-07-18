import React from 'react';
import { FiEdit, FiCamera, FiTrendingUp, FiSearch } from 'react-icons/fi';

const QuickActions = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-1">Quick Actions</h2>
      <p className="text-sm text-gray-500 mb-4">Frequently used functions for efficient workflow</p>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg">
          <FiEdit className="mr-2" /> Analyze Symptoms
        </button>
        <button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg">
          <FiCamera className="mr-2" /> Scan Medicine
        </button>
        <button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg">
          <FiTrendingUp className="mr-2" /> View Revenue
        </button>
        <button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg">
          <FiSearch className="mr-2" /> Search Medicine
        </button>
      </div>
    </div>
  );
};

export default QuickActions;