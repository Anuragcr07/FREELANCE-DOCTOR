import React from 'react';
import { FiFileText, FiCamera, FiBarChart2, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';


const ActionButton = ({ icon, title, subtitle, colorClass, onClick }) => (
  <div 
    className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer"
    onClick={onClick} 
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 ${colorClass}`}>
      {icon}
    </div>
    <h4 className="font-bold text-gray-800">{title}</h4>
    <p className="text-sm text-gray-500">{subtitle}</p>
  </div>
);


const QuickActions = () => {

  const navigate = useNavigate(); 

  return (
    <div className="bg-transparent rounded-xl">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        <ActionButton 
          icon={<FiFileText />} 
          title="Patient Management" 
          subtitle="Add patient details" 
          colorClass="bg-blue-500"  
          onClick={() => navigate('/patient-details')}
        />
        <ActionButton 
          icon={<FiCamera />} 
          title="Scan Medicine" 
          subtitle="Add to inventory" 
          colorClass="bg-orange-500" 
           onClick={() => navigate('/inventory')} 
        />
        <ActionButton 
          icon={<FiBarChart2 />} 
          title="Revenue Analytics" 
          subtitle="Track daily earnings" 
          colorClass="bg-green-500" 
           onClick={() => navigate('/revenue')} 
        />
        <ActionButton 
          icon={<FiSearch />} 
          title="Medicine Search" 
          subtitle="Find medicine details" 
          colorClass="bg-purple-500" 
           onClick={() => navigate('/medicine-db')} 
        />
        <ActionButton
          icon={<FiSearch />}
          title="Symptom Analysis"
          subtitle="check patient symptoms"
          colorClass="bg-blue-500"
          onClick={() => navigate('/symptom-analysis')} 
        /> 
        <ActionButton
          icon={<FiBarChart2 />}
          title="Billing"
          subtitle="Bill patient"
          colorClass="bg-blue-500"
          onClick={() => navigate('/billing')} 
        />
      </div>
    </div>
  );
};

export default QuickActions;