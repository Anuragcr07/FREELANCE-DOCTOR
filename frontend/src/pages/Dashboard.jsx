import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import { FiArchive, FiAlertTriangle, FiDollarSign, FiUsers } from 'react-icons/fi';
import Header from '../components/Header'; 

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // Fetch data from our new single endpoint
        const response = await fetch('http://localhost:5000/api/stats/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data.');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 flex-1 h-screen overflow-y-auto">
      <Header />
      {/* Cards are now powered by the 'stats' state */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Medicines"
          value={stats.totalMedicines}
          subtitle="In stock inventory"
          icon={<FiArchive />}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div>
          {/* Pass the fetched activities as a prop */}
          <RecentActivity activities={stats.recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;