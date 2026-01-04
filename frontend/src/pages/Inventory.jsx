import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, AlertCircle, DollarSign, Search, 
  Filter, Plus, MoreHorizontal, Pill, 
  Download, Loader2, X, Save
} from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, totalValue: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    medicineName: '',
    category: '',
    quantity: '',
    price: '',
    expiryDate: '',
    manufacturer: '',
    minStock: '10'
  });

  const API_URL = '/api/inventory';

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(API_URL);
      setInventory(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error("Error fetching inventory", err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const lowStock = data.filter(item => item.quantity <= (item.minStock || 10)).length;
    const totalValue = data.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setStats({ total, lowStock, totalValue });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note: If you implemented multi-tenancy, add the Authorization header here
      const res = await axios.post(`${API_URL}/add`, formData);
      
      // Update UI
      const updatedInventory = [res.data, ...inventory];
      setInventory(updatedInventory);
      calculateStats(updatedInventory);
      
      // Reset Form & Close
      setFormData({ medicineName: '', category: '', quantity: '', price: '', expiryDate: '', manufacturer: '', minStock: '10' });
      setShowAddForm(false);
      alert("Medicine added successfully!");
    } catch (err) {
      alert("Error adding medicine. Check backend connection.");
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory</h1>
            <p className="text-slate-500 font-medium">Real-time stock monitoring and management.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">
                <Download size={18} /> Export
             </button>
             <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
                    showAddForm ? 'bg-slate-800 text-white' : 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700'
                }`}
             >
                {showAddForm ? <><X size={20} /> Close</> : <><Plus size={20} /> Add Medicine</>}
             </button>
          </div>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Products" value={stats.total} icon={<Package size={20}/>} color="emerald" trend="Live" />
          <StatCard title="Low Stock Items" value={stats.lowStock} icon={<AlertCircle size={20}/>} color="orange" trend="Critical" />
          <StatCard title="Inventory Value" value={`₹${stats.totalValue.toLocaleString()}`} icon={<DollarSign size={20}/>} color="emerald" trend="+4.2%" />
        </div>

        {/* ADD MEDICINE FORM (SLIDE DOWN PANEL) */}
        {showAddForm && (
          <div className="bg-white p-8 rounded-[32px] border-2 border-emerald-100 shadow-xl animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Plus size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Register New Inventory Item</h2>
            </div>
            
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Medicine Name</label>
                <input name="medicineName" value={formData.medicineName} onChange={handleInputChange} required
                       className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" placeholder="e.g. Paracetamol 500mg" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Category</label>
                <input name="category" value={formData.category} onChange={handleInputChange}
                       className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" placeholder="e.g. Analgesic" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Price (₹)</label>
                <input name="price" type="number" value={formData.price} onChange={handleInputChange} required
                       className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" placeholder="0.00" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Current Stock</label>
                <input name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} required
                       className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" placeholder="100" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Min. Stock Alert</label>
                <input name="minStock" type="number" value={formData.minStock} onChange={handleInputChange}
                       className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Expiry Date</label>
                <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleInputChange}
                       className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full py-3.5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                    <Save size={18} /> Save to Database
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input
                type="text"
                placeholder="Filter by medicine name, manufacturer, or category..."
                className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-[24px] shadow-sm shadow-slate-200/50 focus:ring-4 focus:ring-emerald-500/5 text-sm font-medium transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {/* INVENTORY TABLE */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-elite overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-50">
                        <tr className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                            <th className="px-8 py-6">Medicine</th>
                            <th className="px-8 py-6">Category</th>
                            <th className="px-8 py-6">Stock Status</th>
                            <th className="px-8 py-6">Unit Price</th>
                            <th className="px-8 py-6">Expiry</th>
                            <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr><td colSpan="6" className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={32} /></td></tr>
                        ) : inventory.filter(m => m.medicineName?.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Pill size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{item.medicineName}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{item.manufacturer || 'General'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-slate-500">{item.category}</td>
                                <td className="px-8 py-5 min-w-[200px]">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-end">
                                            <span className={`text-[11px] font-black uppercase ${item.quantity <= (item.minStock || 10) ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {item.quantity} Units
                                            </span>
                                            <span className="text-[10px] text-slate-300 font-bold">Limit: {item.minStock}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${item.quantity <= (item.minStock || 10) ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${Math.min((item.quantity / 100) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 font-black text-slate-900 text-sm">₹{item.price?.toFixed(2)}</td>
                                <td className="px-8 py-5 text-slate-400 text-xs font-bold">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-8 py-5 text-right">
                                    <button className="p-2 text-slate-200 hover:text-slate-600 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;