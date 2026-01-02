import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import CriticalStockAlerts from '../components/CriticalStockAlerts';
import WeeklyRevenueChart from '../components/WeeklyRevenueChart'; // Import verified
import { Users, DollarSign, Package, Activity, Plus, Pill, FileText } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 2847,
    dailyRevenue: 4589,
    lowStock: 12,
    activePrescriptions: 156
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col">
        <Header />
        
        <div className="p-8">
          {/* Dashboard Header & Quick Actions */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-500">Welcome back! Here's your medical store overview.</p>
            </div>

            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all">
                <span className="bg-emerald-200 rounded-lg px-1 text-[10px]">⚡</span> Quick
              </button>
              <div className="w-px h-6 bg-slate-100 mx-1" />
              <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors">
                <Plus size={18} /> Add Patient
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors">
                <Pill size={18} /> New Medicine
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors">
                <FileText size={18} /> Create Bill
              </button>
            </div>
          </div>

          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Patients" 
              value={stats.totalPatients.toLocaleString()} 
              trend="+12.5%" 
              icon={<Users size={20} />}
              color="emerald"
            />
            <StatCard 
              title="Daily Revenue" 
              value={`$${stats.dailyRevenue.toLocaleString()}`} 
              trend="+8.2%" 
              icon={<DollarSign size={20} />}
              color="emerald"
            />
            <StatCard 
              title="Total Products" 
              value="1,234" 
              trend="-2.4%" 
              subtitle="low stock items"
              icon={<Package size={20} />}
              color="orange"
            />
            <StatCard 
              title="Active Prescriptions" 
              value={stats.activePrescriptions} 
              trend="+5.8%" 
              icon={<Activity size={20} />}
              color="emerald"
            />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Real Chart Component replacing the Mock Area */}
            <div className="lg:col-span-2">
               <WeeklyRevenueChart />
            </div>

            {/* Critical Alerts Card */}
            <div className="lg:col-span-1">
              <CriticalStockAlerts />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;