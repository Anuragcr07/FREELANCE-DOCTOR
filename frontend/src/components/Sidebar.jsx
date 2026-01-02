import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Pill, Users, Package, 
  DollarSign, BarChart2, Settings, HelpCircle, ChevronLeft 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/patient-details", icon: <Users size={20} />, label: "Patients" },
    { to: "/inventory", icon: <Package size={20} />, label: "Inventory" },
    { to: "/billing", icon: <DollarSign size={20} />, label: "Billing" },
    { to: "/revenue", icon: <BarChart2 size={20} />, label: "Analytics" },
    { to: "/symptom-analysis", icon: <HelpCircle size={20} />, label: "Symptom Analysis" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 h-screen sticky top-0">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 group-hover:rotate-12 transition-transform">
            <Pill size={22} />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">MedFlow</span>
        </div>
        <ChevronLeft size={18} className="text-slate-300 hover:text-slate-600 cursor-pointer" />
      </div>

      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-50' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
            `}
          >
            {item.icon}
            <span className="font-bold text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-emerald-50/50 rounded-2xl border border-emerald-50">
        <p className="text-[10px] font-bold text-emerald-600 mb-1 uppercase tracking-wider">Need help?</p>
        <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">Check documentation for quick answers.</p>
        <div className="flex justify-between items-center">
          <HelpCircle size={16} className="text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-600 underline cursor-pointer">Support</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;