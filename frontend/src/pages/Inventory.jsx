import React from 'react';
import { 
  FiBarChart2, 
  FiFileText, 
  FiArchive, 
  FiDollarSign, 
  FiHeart, 
  FiAlertTriangle, 
  FiCamera, 
  FiPlus,
  FiSearch,
  FiBox,
  FiCalendar
} from 'react-icons/fi';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
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
      <main className="p-4 space-y-6">
        {/* Low Stock Alerts */}
        <section className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start">
            <FiAlertTriangle className="h-6 w-6 text-orange-500 mr-4" />
            <div>
              <h2 className="text-xl font-bold text-orange-800">Low Stock Alerts</h2>
              <p className="text-orange-700">These medicines need immediate restocking</p>
            </div>
          </div>
          <div className="mt-4 bg-white p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800">Insulin Glargine</h3>
            <p className="text-sm text-slate-500">Only 5 units left</p>
          </div>
        </section>

        {/* Add Medicine Form */}
        <section className="bg-white p-8 rounded-lg shadow-sm">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <FiCamera className="h-7 w-7 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-800">Add Medicine via Photo Scan</h2>
            </div>
            <p className="text-slate-500">Scan medicine packaging to automatically extract details</p>
          </div>
          <button className="w-full flex items-center justify-center px-6 py-3 mb-8 text-md font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <FiCamera className="mr-2" /> Take Photo & Scan Medicine
          </button>

          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="medicineName" className="block text-sm font-medium text-slate-700 mb-1">Medicine Name *</label>
                <input type="text" id="medicineName" placeholder="Enter medicine name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="manufacturer" className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                <input type="text" id="manufacturer" placeholder="Manufacturer name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="batchNumber" className="block text-sm font-medium text-slate-700 mb-1">Batch Number</label>
                <input type="text" id="batchNumber" placeholder="Batch number" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div className="relative">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <input type="text" id="expiryDate" placeholder="dd-mm-yyyy" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                <FiCalendar className="absolute right-3 top-9 text-slate-400" />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">Quantity *</label>
                <input type="text" id="quantity" placeholder="Number of units" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price per unit (₹) *</label>
                <input type="text" id="price" placeholder="Price in rupees" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input type="text" id="category" placeholder="Medicine category" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="minStock" className="block text-sm font-medium text-slate-700 mb-1">Minimum Stock Level</label>
                <input type="text" id="minStock" placeholder="Minimum quantity alert" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
            </div>
            <button type="submit" className="w-full mt-8 flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-slate-800 rounded-lg hover:bg-slate-900">
              <FiPlus className="mr-2" /> Add Medicine to Inventory
            </button>
          </form>
        </section>

        {/* Current Inventory */}
        <section className="bg-white p-8 rounded-lg shadow-sm">
           <div className="mb-6">
              <div className="flex items-center mb-2">
                <FiBox className="h-7 w-7 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">Current Inventory</h2>
              </div>
              <p className="text-slate-500">Manage and track your medicine inventory</p>
            </div>
            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search medicines by name, manufacturer, or category..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg"
              />
            </div>
            
            {/* Inventory Item */}
            <div className="border border-slate-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                        <h3 className="text-lg font-bold text-slate-800 mr-3">Paracetamol 500mg</h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">150 units</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">
                      ₹25 <span className="text-sm font-normal text-slate-500">per unit</span>
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-slate-600">
                    <p><span className="font-semibold">Manufacturer:</span> ABC Pharma</p>
                    <p><span className="font-semibold">Batch:</span> PAR2024001</p>
                    <p><span className="font-semibold">Expires:</span> 2025-12-31</p>
                    <p><span className="font-semibold">Category:</span> Analgesic</p>
                    <p><span className="font-semibold">Min Stock:</span> 50</p>
                </div>
            </div>
            {/* Add more inventory items here */}
        </section>
      </main>
    </div>
  );
};

export default Inventory;