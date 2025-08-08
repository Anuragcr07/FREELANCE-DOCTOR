import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-white border-b">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Medical Store Management</h1>
      </div>
      <div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-200 transition-colors">
          Store Manager
        </button>
      </div>
    </div>
  );
};

export default Header;