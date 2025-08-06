import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar'; // Import the new Sidebar component
import { FiAlertTriangle, FiDollarSign, FiUsers, FiFileText } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to manage sidebar visibility

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
     
        const mockData = {
          lowStockCount: 4,
          dailyRevenue: 1860.00,
          patientsServed: 1,
          recentActivities: [], // The screenshot shows no recent activity
        };
        setStats(mockData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading Dashboard...</div></div>;
  if (error) return <div className="flex justify-center items-center h-screen"><div className="text-xl text-red-500">Error: {error}</div></div>;

  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 h-screen overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header title="Dashboard Pro" toggleSidebar={toggleSidebar} />
        <div className="p-8">
          {/* Stat Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                  isActionCard={true}
                  title="Symptom Analysis"
                  subtitle="AI-powered checkup"
                  icon={<FiFileText />}
                  color="bg-blue-500"
              />
              <DashboardCard
                  title="Low Stock Alert"
                  value={stats.lowStockCount}
                  subtitle="Items need restock"
                  icon={<FiAlertTriangle />}
                  color="bg-orange-500"
              />
              <DashboardCard
                  title="Daily Revenue"
                  value={`₹${stats.dailyRevenue.toFixed(2)}`}
                  subtitle="Today's earnings"
                  icon={<FiDollarSign />}
                  color="bg-green-500"
              />
              <DashboardCard
                  title="Patients Served"
                  value={stats.patientsServed}
                  subtitle="Today's count"
                  icon={<FiUsers />}
                  color="bg-purple-500"
              />
          </div>
          
          {/* Main Content Area: Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <QuickActions />
            </div>
            <div>
              <RecentActivity activities={stats.recentActivities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;