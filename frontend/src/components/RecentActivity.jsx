import React from 'react';
import { FiLink, FiPlusCircle, FiAlertTriangle } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

// A helper component to render different activity types
const ActivityItem = ({ activity }) => {
  let icon, bgColor, textColor, detailsNode;

  switch (activity.type) {
    case 'sale':
      icon = <FiLink className="text-blue-500" />;
      bgColor = 'bg-blue-50';
      textColor = 'text-slate-800';
      detailsNode = <p className="font-semibold">{activity.details}</p>;
      break;
    case 'stock_add':
      icon = <FiPlusCircle className="text-green-500" />;
      bgColor = 'bg-green-50';
      textColor = 'text-green-600';
      detailsNode = <p className="font-semibold">{activity.details}</p>;
      break;
    case 'low_stock':
      icon = <FiAlertTriangle className="text-red-500" />;
      bgColor = 'bg-orange-50';
      textColor = 'text-red-500';
      detailsNode = (
        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {activity.details}
        </div>
      );
      break;
    default:
      icon = <FiLink />;
      bgColor = 'bg-gray-50';
  }

  return (
    <li className={`flex items-center justify-between p-3 ${bgColor} rounded-lg mb-3`}>
      <div className="flex items-center">
        <div className="mr-3 flex-shrink-0">{icon}</div>
        <div>
          <p className="text-sm">{activity.message}</p>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className={`ml-2 flex-shrink-0 ${textColor}`}>
        {detailsNode}
      </div>
    </li>
  );
};


const RecentActivity = ({ activities = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-1">Recent Activity</h2>
      <p className="text-sm text-gray-500 mb-4">Latest transactions and updates</p>
      {activities.length > 0 ? (
        <ul>
          {activities.map(activity => (
            <ActivityItem key={activity._id} activity={activity} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-4">No recent activity to show.</p>
      )}
    </div>
  );
};

export default RecentActivity;