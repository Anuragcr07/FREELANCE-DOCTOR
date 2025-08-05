import React from 'react';
import { 
  FiGrid, 
  FiLink, 
  FiUser, 
  FiDollarSign, 
  FiLogOut 
} from 'react-icons/fi';

const NavItem = ({ icon, children, active }) => (
  <a
    href="#"
    className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200 ${
      active ? 'bg-blue-100 text-blue-600 font-semibold' : ''
    }`}
  >
    {icon}
    <span className="ml-3">{children}</span>
  </a>
);

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      <div>
        <div className="mb-8">
          {/* This empty div is for spacing, to push the nav items down slightly to match the image */}
        </div>
        <nav className="space-y-2">
          <NavItem icon={<FiGrid />} active>Dashboard</NavItem>
          <NavItem icon={<FiLink />}>Medicine DB</NavItem>
          <NavItem icon={<FiUser />}>Patient Details</NavItem>
          <NavItem icon={<FiDollarSign />}>Billing</NavItem>
        </nav>
      </div>
      <div className="mt-auto">
        <NavItem icon={<FiLogOut />}>Logout</NavItem>
      </div>
    </div>
  );
};

export default Sidebar;