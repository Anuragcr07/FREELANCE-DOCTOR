import React, { useState, useEffect } from 'react';
import { 
  FiBarChart2, 
  FiFileText, 
  FiArchive, 
  FiDollarSign, 
  FiHeart, 
  FiUser,
  FiAlertTriangle, 
  FiPlus,
  FiSearch,
  FiBox
} from 'react-icons/fi';
import Layout from '../components/Layout'; // Use the reusable Layout
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [formData, setFormData] = useState({
    medicineName: '', manufacturer: '', batchNumber: '',
    expiryDate: '', quantity: '', price: '', category: '', minStock: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = '/api/inventory'; 

  useEffect(() => {

    const fetchInitialData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [inventoryRes, lowStockRes] = await Promise.all([
                axios.get(API_URL),
                axios.get(`${API_URL}/low-stock`)
            ]);
            setInventory(inventoryRes.data);
            setLowStock(lowStockRes.data);
        } catch (err) {
            console.error("Error fetching inventory data:", err);
            setError("Failed to load inventory data. Please check the server connection.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchInitialData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/add`, formData);
      alert('Medicine added successfully!');
      // Add new item to the top of the list for immediate feedback
      setInventory(prev => [response.data, ...prev]); 
      // Re-check low stock alerts
      if (response.data.quantity <= response.data.minStock) {
        setLowStock(prev => [response.data, ...prev]);
      }
      setFormData({ 
        medicineName: '', manufacturer: '', batchNumber: '',
        expiryDate: '', quantity: '', price: '', category: '', minStock: '',
      });
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert('Failed to add medicine. Please check the details and try again.');
    }
  };
  
  const filteredInventory = inventory.filter(item =>
    item.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.manufacturer && item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  if (isLoading) return <Layout><div className="text-center p-8">Loading Inventory...</div></Layout>;
  if (error) return <Layout><div className="text-center p-8 text-red-500">{error}</div></Layout>;

  return (
    <Layout>
   

      <main className="space-y-6">
        {/* Low Stock Alerts */}
        {lowStock.length > 0 && (
          <section className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-start mb-4">
              <FiAlertTriangle className="h-6 w-6 text-orange-500 mr-4 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-orange-800">Low Stock Alerts</h2>
                <p className="text-orange-700">The following items need immediate restocking.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {lowStock.map(item => (
                <div key={item._id} className="bg-white p-3 rounded-lg border border-orange-200">
                    <h3 className="font-semibold text-slate-800">{item.medicineName}</h3>
                    <p className="text-sm text-red-600 font-medium">Only {item.quantity} units left (Min: {item.minStock})</p>
                </div>
                ))}
            </div>
          </section>
        )}

        {/* Add Medicine Form */}
        <section className="bg-white p-6 lg:p-8 rounded-lg shadow-sm">
          <div className="flex items-center mb-6">
            <FiPlus className="h-7 w-7 text-blue-600 mr-3" />
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Add New Medicine</h2>
                <p className="text-slate-500">Fill the details to add a new item to the inventory.</p>
            </div>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="medicineName" className="block text-sm font-medium text-slate-700 mb-1">Medicine Name *</label>
                <input type="text" id="medicineName" value={formData.medicineName} onChange={handleInputChange} placeholder="e.g., Paracetamol 500mg" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              <div>
                <label htmlFor="manufacturer" className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                <input type="text" id="manufacturer" value={formData.manufacturer} onChange={handleInputChange} placeholder="e.g., Cipla" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="batchNumber" className="block text-sm font-medium text-slate-700 mb-1">Batch No.</label>
                <input type="text" id="batchNumber" value={formData.batchNumber} onChange={handleInputChange} placeholder="e.g., B12345" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <input type="date" id="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">Quantity *</label>
                <input type="number" id="quantity" value={formData.quantity} onChange={handleInputChange} placeholder="e.g., 100" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">Price (₹) *</label>
                <input type="number" step="0.01" id="price" value={formData.price} onChange={handleInputChange} placeholder="e.g., 25.50" className="w-full px-4 py-2 border border-slate-300 rounded-lg" required />
              </div>
               <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input type="text" id="category" value={formData.category} onChange={handleInputChange} placeholder="e.g., Analgesic" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="minStock" className="block text-sm font-medium text-slate-700 mb-1">Min. Stock</label>
                <input type="number" id="minStock" value={formData.minStock} onChange={handleInputChange} placeholder="e.g., 10" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
              </div>
            </div>
            <button type="submit" className="w-full mt-6 flex items-center justify-center px-6 py-3 text-lg font-semibold text-black bg-blue-600 rounded-lg hover:bg-blue-700">
              <FiPlus className="mr-2" /> Add to Inventory
            </button>
          </form>
        </section>

      </main>
    </Layout>
  );
};

export default Inventory;