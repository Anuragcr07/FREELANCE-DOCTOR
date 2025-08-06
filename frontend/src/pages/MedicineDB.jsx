import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FiBarChart2, 
  FiFileText, 
  FiArchive, 
  FiDollarSign, 
  FiHeart, 
  FiUser,
  FiSearch,
  FiBookOpen,
  FiTag
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const MedicineDB = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url =  searchQuery
          ? `/api/medicines/search?q=${searchQuery}`
          : '/api/medicines/';
        const response = await axios.get(url);
        setMedicines(response.data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setError('Failed to load medicine data. Please try again.');
        setMedicines([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchMedicines();
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery]); 

  const renderMedicineList = () => {
    if (isLoading) {
      return <p className="text-center text-slate-500 py-8">Loading medicines...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500 py-8">{error}</p>;
    }
    if (medicines.length === 0) {
      return (
        <p className="text-center text-slate-500 py-8">
          {searchQuery ? "No medicines found matching your search." : "The medicine database is empty."}
        </p>
      );
    }
    return medicines.map(med => (
      <div key={med._id} className="border border-slate-200 rounded-lg p-4 transition-all hover:shadow-md hover:border-blue-300">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
          <div>
            {/* ✅ CORRECTED: Used `medicineName` to match the schema */}
            <h3 className="text-lg font-bold text-slate-800">{med.medicineName}</h3>
            {med.manufacturer && <p className="text-sm text-slate-500">by {med.manufacturer}</p>}
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
             <p className="text-lg font-bold text-green-600">
                ₹{med.price ? med.price.toFixed(2) : 'N/A'}
             </p>
             {/* ✅ CORRECTED: Used `quantity` to match the schema */}
             <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${
                med.quantity > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
             }`}>
                {med.quantity > 0 ? `${med.quantity} in stock` : 'Out of Stock'}
             </span>
          </div>
        </div>
        <div className="text-sm text-slate-600 space-y-2 mt-2">
          {med.indications && med.indications !== 'N/A' && <p><span className="font-semibold">Used for:</span> {med.indications}</p>}
          <p>
              <span className="font-semibold">Category:</span> 
              <span className="ml-2 inline-flex items-center bg-slate-100 text-slate-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  <FiTag className="mr-1.5 h-3 w-3"/>{med.category || 'Uncategorized'}
              </span>
          </p>
          {med.isRx && <p className="font-semibold text-blue-600">Requires Prescription (Rx)</p>}
        </div>
      </div>
    ));
  };

  return (
    <Layout>
    

      {/* Main Content Area */}
      <main className="bg-white p-6 lg:p-8 rounded-lg shadow-sm">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <FiBookOpen className="h-7 w-7 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-slate-800">Medicine Database</h2>
          </div>
          <p className="text-slate-500">Search the master database for all available medicines.</p>
        </div>
        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, category, or use..."
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
          
        <div className="space-y-4">
          {renderMedicineList()}
        </div>
      </main>
    </Layout>
  );
};

export default MedicineDB;