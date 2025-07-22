import React, { useState, useEffect } from 'react';
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
  FiCalendar,
  FiLink
} from 'react-icons/fi';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [formData, setFormData] = useState({
    medicineName: '',
    manufacturer: '',
    batchNumber: '',
    expiryDate: '',
    quantity: '',
    price: '',
    category: '',
    minStock: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = '/api/inventory'; 

  useEffect(() => {
    fetchInventory();
    fetchLowStockAlerts();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(API_URL);
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const fetchLowStockAlerts = async () => {
    try {
      const response = await axios.get(`${API_URL}/low-stock`);
      setLowStock(response.data);
    } catch (error) {
      console.error("Error fetching low stock alerts:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/add`, formData);
      alert('Medicine added successfully!');
      fetchInventory(); 
      fetchLowStockAlerts(); 
      setFormData({ 
        medicineName: '', manufacturer: '', batchNumber: '',
        expiryDate: '', quantity: '', price: '', category: '', minStock: '',
      });
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert('Failed to add medicine.');
    }
  };
  

  const filteredInventory = inventory.filter(item =>
    item.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans">
      <Header />

      
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
        {/* Low Stock Alerts */}
        {lowStock.length > 0 && (
          <section className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start">
              <FiAlertTriangle className="h-6 w-6 text-orange-500 mr-4" />
              <div>
                <h2 className="text-xl font-bold text-orange-800">Low Stock Alerts</h2>
                <p className="text-orange-700">These medicines need immediate restocking</p>
              </div>
            </div>
            {lowStock.map(item => (
              <div key={item._id} className="mt-4 bg-white p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-800">{item.medicineName}</h3>
                <p className="text-sm text-slate-500">Only {item.quantity} units left</p>
              </div>
            ))}
          </section>
        )}

        {/* Add Medicine Form */}
        <section className="bg-white p-8 rounded-lg shadow-sm">
          <div className="flex items-center mb-6">
            <FiPlus className="h-7 w-7 text-slate-500 mr-3" />
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Add New Medicine</h2>
                <p className="text-slate-500">Fill in the details to add a new item to the inventory</p>
            </div>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medicine Name */}
              <div>
                <label htmlFor="medicineName" className="block text-sm font-medium text-slate-700 mb-1">Medicine Name *</label>
                <input type="text" id="medicineName" value={formData.medicineName} onChange={handleInputChange} placeholder="Enter medicine name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              {/* Manufacturer */}
              <div>
                <label htmlFor="manufacturer" className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                <input type="text" id="manufacturer" value={formData.manufacturer} onChange={handleInputChange} placeholder="Manufacturer name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              {/* Batch Number */}
              <div>
                <label htmlFor="batchNumber" className="block text-sm font-medium text-slate-700 mb-1">Batch Number</label>
                <input type="text" id="batchNumber" value={formData.batchNumber} onChange={handleInputChange} placeholder="Batch number" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              {/* Expiry Date */}
              <div className="relative">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <input type="date" id="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">Quantity *</label>
                <input type="number" id="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="Number of units" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price per unit (₹) *</label>
                <input type="number" id="price" value={formData.price} onChange={handleInputChange} placeholder="Price in rupees" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input type="text" id="category" value={formData.category} onChange={handleInputChange} placeholder="Medicine category" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              {/* Min Stock */}
              <div>
                <label htmlFor="minStock" className="block text-sm font-medium text-slate-700 mb-1">Minimum Stock Level</label>
                <input type="number" id="minStock" value={formData.minStock} onChange={handleInputChange} placeholder="Minimum quantity alert" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Inventory Items */}
            <div className="space-y-4">
              {filteredInventory.length > 0 ? (
                filteredInventory.map(item => (
                  <div key={item._id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                              <h3 className="text-lg font-bold text-slate-800 mr-3">{item.medicineName}</h3>
                              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">{item.quantity} units</span>
                          </div>
                          <p className="text-lg font-bold text-green-600">
                            ₹{item.price} <span className="text-sm font-normal text-slate-500">per unit</span>
                          </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-slate-600">
                          <p><span className="font-semibold">Manufacturer:</span> {item.manufacturer || 'N/A'}</p>
                          <p><span className="font-semibold">Batch:</span> {item.batchNumber || 'N/A'}</p>
                          <p><span className="font-semibold">Expires:</span> {new Date(item.expiryDate).toLocaleDateString() || 'N/A'}</p>
                          <p><span className="font-semibold">Category:</span> {item.category || 'N/A'}</p>
                          <p><span className="font-semibold">Min Stock:</span> {item.minStock}</p>
                      </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500">No inventory found.</p>
              )}
            </div>
        </section>
      </main>
    </div>
  );
};

export default Inventory;