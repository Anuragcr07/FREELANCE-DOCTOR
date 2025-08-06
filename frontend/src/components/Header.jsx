import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Header = ({ children }) => {
  return (
    <header className="bg-white shadow-sm flex items-center justify-between p-4">
      {/* Children will typically be the mobile menu button */}
      <div>{children}</div>
      
      <div className="flex items-center">
        <div className="flex items-center cursor-pointer text-slate-600 hover:text-slate-900">
          <span className="font-medium">Store Manager</span>
          <FiChevronDown className="ml-1" />
        </div>
      </div>
    </header>
  );
};

export default Header;