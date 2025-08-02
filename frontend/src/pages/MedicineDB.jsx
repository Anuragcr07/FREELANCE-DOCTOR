import React, { useState, useEffect } from 'react';
import { 
  FiBarChart2, 
  FiFileText, 
  FiArchive, 
  FiDollarSign, 
  FiLink,
  FiSearch,
  FiBookOpen,
  FiTag
} from 'react-icons/fi';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MedicineDB = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedMedicines, setDisplayedMedicines] = useState([]);
  const [initialInventory, setInitialInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/medicines/all');
        setInitialInventory(response.data);
        setDisplayedMedicines(response.data); // Display all medicines initially
      } catch (error) {
        console.error("Error fetching initial medicine list:", error);
        alert('Failed to load medicine database.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []); 

 
  useEffect(() => {
    const performSearch = async (query) => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/medicines/search?q=${query}`);
        setDisplayedMedicines(response.data); // Display search results
      } catch (error) {
        console.error("Error searching medicines:", error);
      } finally {
        setIsLoading(false);
      }
    };

   
    const timerId = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        performSearch(searchQuery);
      } else {
        setDisplayedMedicines(initialInventory);
      }
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchQuery, initialInventory]); 

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans">
      <Header />

      
      <nav className="px-4 pt-4">
        <div className="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2">
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/dashboard')}>
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
            <FiLink className="mr-2" /> Medicine DB
          </button>
           <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/patient-details')}>
                                  <FiLink className="mr-2" /> Patient Details
                              </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/billing')}>
            <FiDollarSign className="mr-2" /> Billing
          </button>
        </div>
      </nav>

      <main className="p-4 space-y-6">
        
        <section className="bg-white p-8 rounded-lg shadow-sm">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FiBookOpen className="h-7 w-7 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-800">Medicine Database Search</h2>
            </div>
            <p className="text-slate-500">Search the master database for medicine details, indications, and stock status.</p>
          </div>
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, generic name, category, or indication..."
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            
         
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-slate-500 py-4">Loading Medicines...</p>
            ) : displayedMedicines.length > 0 ? (
              displayedMedicines.map(med => (
                <div key={med._id} className="border border-slate-200 rounded-lg p-4 transition-all hover:shadow-md hover:border-blue-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mr-3">{med.name}</h3>
                      {med.genericName !== 'N/A' && <p className="text-sm text-slate-500">{med.genericName}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                       {med.price !== null ? (
                          <p className="text-lg font-bold text-green-600">
                            ₹{med.price} <span className="text-sm font-normal text-slate-500">per unit</span>
                          </p>
                        ) : (
                          <p className="text-sm font-semibold text-slate-400">Price not set</p>
                        )}
                       {med.stock > 0 ? (
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full mt-1">
                            {med.stock} units in stock
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full mt-1">
                            Out of Stock
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1 mt-2">
                    {med.indications !== 'N/A' && <p><span className="font-semibold">Indications:</span> {med.indications}</p>}
                    <p>
                        <span className="font-semibold">Category:</span> 
                        <span className="ml-2 inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                            <FiTag className="mr-1"/>{med.category || 'N/A'}
                        </span>
                    </p>
                    {med.isRx && <p className="font-semibold text-blue-600">Prescription (Rx) Required</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 py-4">
                {searchQuery ? "No medicines found matching your query." : "No medicines in inventory."}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MedicineDB;