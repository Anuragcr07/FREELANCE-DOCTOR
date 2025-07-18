import React from 'react';
import DashboardCard from '../components/DashboardCard';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';
import { FiArchive, FiAlertTriangle, FiDollarSign, FiUsers } from 'react-icons/fi';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 flex-1 h-screen overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Medicines"
          value="1247"
          subtitle="In stock inventory"
          icon={<FiArchive />}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Low Stock Alert"
          value="23"
          subtitle="Items need restock"
          icon={<FiAlertTriangle />}
          color="bg-orange-500"
        />
        <DashboardCard
          title="Daily Revenue"
          value="₹15,420"
          subtitle="Today's earnings"
          icon={<FiDollarSign />}
          color="bg-green-500"
        />
        <DashboardCard
          title="Patients Served"
          value="89"
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
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;