import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import QuickActions from '../components/QuickActions';
import WeeklyRevenueChart from '../components/WeeklyRevenueChart';
import CriticalStockAlerts from '../components/CriticalStockAlerts';
import {
  FiBox,
  FiAlertTriangle,
  FiDollarSign,
  FiUsers,
  FiArrowUp,
  FiShoppingCart,
  FiClock
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://freelance-doctor-07.onrender.com/api/stats/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err.message);
        setError("Could not load live data. Displaying sample data.");
        setStats({
          totalMedicines: 1247,
          lowStockCount: 23,
          dailyRevenue: 15420,
          patientsServed: 89,
          pendingOrders: 12,
          expiringSoon: 8,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading Dashboard...</div></div>;

  return (
    <div className="flex flex-col">
      <Header />
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-500">Monitor your medical store operations and key metrics</p>
        </div>
        
        {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {/* Stat Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Medicines"
              value={stats?.totalMedicines}
              subtitle="+12% from last month"
              icon={<FiBox />}
              trend={{ icon: <FiArrowUp className="text-green-500" /> }}
              colorClass="bg-white"
            />
            <DashboardCard
              title="Low Stock Alert"
              value={stats?.lowStockCount}
              subtitle="Items need restock"
              icon={<FiAlertTriangle />}
              colorClass="bg-orange-100"
            />
            <DashboardCard
              title="Daily Revenue"
              value={`₹${stats?.dailyRevenue.toLocaleString()}`}
              subtitle="+8.2% from yesterday"
              icon={<FiDollarSign />}
              trend={{ icon: <FiArrowUp className="text-green-500" /> }}
              colorClass="bg-green-100"
            />
            <DashboardCard
              title="Patients Served"
              value={stats?.patientsServed}
              subtitle="Today's count"
              icon={<FiUsers />}
              colorClass="bg-purple-100"
            />
             
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Charts and Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <WeeklyRevenueChart />
          </div>
          <div className="lg:col-span-2 space-y-8">
             <CriticalStockAlerts />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;