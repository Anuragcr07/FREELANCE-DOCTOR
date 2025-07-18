import React from 'react';
import { FiHome, FiBarChart2, FiLayers, FiDollarSign, FiDatabase } from 'react-icons/fi';

const Sidebar = () => {
  return (
    // Set a fixed width and use flexbox for vertical alignment. Increased padding.
    <div className="w-60 bg-white h-screen p-5 shadow-lg">
      
      {/* Logo and Title Section */}
      {/* Increased bottom margin to create more space before the nav links */}
      <div className="flex items-center mb-16">
        <div className="bg-blue-600 p-3 rounded-lg mr-4">
          <FiHome className="text-white text-2xl" />
        </div>
        {/* Adjusted font size and used <br /> to split the title into two lines */}
        <h1 className="text-1xl font-bold text-gray-800 leading-tight">
          MediSto<br />Pro
        </h1>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul>
          {/* Active Link: Added a subtle shadow and adjusted padding for a better look */}
          <li className="mb-4">
            <a href="#" className="flex items-center py-2 px-4 text-white bg-blue-600 rounded-lg shadow-md">
              <FiHome className="mr-3" /> Dashboard
            </a>
          </li>

          {/* Inactive Links: Adjusted text color and padding */}
          <li className="mb-4">
            <a href="#" className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg">
              <FiBarChart2 className="mr-3" /> Symptom Analysis
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg">
              <FiLayers className="mr-3" /> Inventory
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg">
              <FiDollarSign className="mr-3" /> Revenue
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg">
              <FiDatabase className="mr-3" /> Medicine DB
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;