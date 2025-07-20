import React from 'react';
import { FiBarChart2, FiFileText, FiArchive, FiDollarSign, FiHeart, FiUser, FiSearch } from 'react-icons/fi';
import Header from '../components/Header'; // Assuming you have a Header component
import { useNavigate } from 'react-router-dom'; 
const SymptomAnalysis = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <Header />

      {/* Navigation Tabs */}
      <nav className="px-4 pt-4">
        <div className="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2">
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/')}>
            <FiBarChart2 className="mr-2" /> Dashboard
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/symptom-analysis')}>
            <FiFileText className="mr-2" /> Symptom Analysis
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/inventory')}>
            <FiArchive className="mr-2" /> Inventory
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/revenue')}>
            <FiDollarSign className="mr-2" /> Revenue
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/medicine-db')}>
            <FiHeart className="mr-2" /> Medicine DB
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          {/* Form Header */}
          <div className="flex items-center mb-6">
            <FiUser className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Patient Information & Symptom Analysis</h2>
              <p className="text-slate-500">Enter patient details and symptoms to get medicine recommendations from inventory</p>
            </div>
          </div>

          {/* Form */}
          <form>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-slate-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  placeholder="Enter patient's full name"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">
                  Age
                </label>
                <input
                  type="text"
                  id="age"
                  placeholder="Age in years"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  placeholder="Male/Female/Other"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700 mb-1">
                Symptoms & Medical Issues
              </label>
              <textarea
                id="symptoms"
                rows="6"
                placeholder="Describe patient's symptoms in detail (e.g., fever, headache, cough, cold, stomach pain, etc.)"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSearch className="mr-3" />
              Analyze & Get Medicine Recommendations
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SymptomAnalysis;