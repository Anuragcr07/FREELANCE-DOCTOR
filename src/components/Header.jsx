import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-50 border-b">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div>
        <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium">
          Store Manager
        </button>
      </div>
    </header>
  );
};

export default Header;