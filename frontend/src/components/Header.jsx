import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="bg-white p-6 shadow-sm flex justify-between items-center sticky top-0 z-10">
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <div>
        <button className="bg-white border border-green-500 text-green-600 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition duration-200">
          Store Manager
        </button>
      </div>
    </header>
  );
};

export default Header;