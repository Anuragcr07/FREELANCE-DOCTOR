

import React from 'react'
import { FiBarChart2 } from 'react-icons/fi';

const Header = () => {
  return (
    <div>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FiBarChart2 className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">MediStore Pro</h1>
          </div>
        </div>
        <button className="px-4 py-2 text-sm font-semibold text-green-700 bg-green-100 border border-green-200 rounded-full hover:bg-green-200">
          Store Manager
        </button>
      </header>
      
    </div>
  )
}

export default Header;
