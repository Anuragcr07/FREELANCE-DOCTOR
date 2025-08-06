import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiLink, FiUser, FiDollarSign, FiLogOut, FiX } from 'react-icons/fi';

const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-blue-100 text-blue-600 font-semibold' : ''
      }`
    }
  >
    {icon}
    <span className="ml-3">{children}</span>
  </NavLink>
);

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-30 z-30 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        <div>
           <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-bold text-slate-800">MyClinic</h1>
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800">
                <FiX size={24}/>
            </button>
           </div>
          <nav className="space-y-2">
            <NavItem to="/dashboard" icon={<FiGrid size={20} />}>Dashboard</NavItem>
            <NavItem to="/medicine-db" icon={<FiLink size={20} />}>Medicine DB</NavItem>
            <NavItem to="/patient-details" icon={<FiUser size={20} />}>Patient Details</NavItem>
            <NavItem to="/billing" icon={<FiDollarSign size={20} />}>Billing</NavItem>
            <NavItem to="/revenue" icon={<FiDollarSign size={20} />}>Revenue</NavItem>
            <NavItem to="/inventory" icon={<FiGrid size={20} />}>Inventory</NavItem>
          </nav>
        </div>
        <div className="mt-auto">
          <NavItem to="/" icon={<FiLogOut size={20} />}>Logout</NavItem>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;