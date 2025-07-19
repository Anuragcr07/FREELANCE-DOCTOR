import React from 'react';
import { FiEdit, FiCamera, FiTrendingUp, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-1">Quick Actions</h2>
      <p className="text-sm text-gray-500 mb-4">Frequently used functions for efficient workflow</p>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg" onClick={() => {
          // This should ideally navigate to a symptom analysis page
          navigate('/symptom-analysis');
        }}>
          <FiEdit className="mr-2" /> Analyze Symptoms
        </button>
        <button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg" onClick={() => {
          navigate('/medicine-db');
        }}>
          <FiCamera className="mr-2" /> Scan Medicine
        </button>
        <button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg" onClick={() => {
          // This should ideally navigate to a revenue view page
          navigate('/revenue');
        }}>
          <FiTrendingUp className="mr-2" /> View Revenue
        </button>
        <button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-lg" onClick={() => {
          navigate('/medicine-db');
        }}>
          <FiSearch className="mr-2" /> Search Medicine
        </button>
      </div>
    </div>
  );
};

export default QuickActions;