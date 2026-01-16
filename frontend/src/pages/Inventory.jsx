import React, { useState, useEffect } from 'react';
import { 
  Package, AlertCircle, DollarSign, Search, 
  Filter, Plus, MoreHorizontal, Pill, 
  Download, Loader2, X, Save, AlertTriangle, Hash
} from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import API from '../services/api'; 

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, totalValue: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    medicineName: '',
    category: '',
    quantity: '',
    price: '',
    expiryDate: '',
    manufacturer: '',
    batchNumber: '', // Added Batch Number
    minStock: '10'
  });

  const API_URL = '/inventory';

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await API.get(API_URL);
      setInventory(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error("Error fetching inventory", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to sync inventory with server.");
      }
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
      const res = await API.post(`${API_URL}/add`, formData);
      const updatedInventory = [res.data, ...inventory];
      setInventory(updatedInventory);
      calculateStats(updatedInventory);
      
      setFormData({ medicineName: '', category: '', quantity: '', price: '', expiryDate: '', manufacturer: '', batchNumber: '', minStock: '10' });
      setShowAddForm(false);
      alert("Medicine added to your secure database!");
    } catch (err) {
      console.error("Error adding medicine", err);
      alert("Permission denied or server error.");
    }
  };

  const filteredInventory = inventory.filter(m => 
    m.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.batchNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory</h1>
            <p className="text-slate-500 font-medium">Manage your pharmacy's unique stock profile.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className={`flex items-center gap-2 px-6 py-2.5 font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
                    showAddForm ? 'bg-slate-800 text-black shadow-none' : 'bg-emerald-600 text-black shadow-emerald-500/20 hover:bg-emerald-700'
                }`}
             >
                {showAddForm ? <><X size={20} /> Cancel</> : <><Plus size={20} /> Add Medicine</>}
             </button>
          </div>
        </div>

        {error && (
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 text-orange-700 text-sm font-bold shadow-sm">
                <AlertTriangle size={18} /> {error}
            </div>
        )}

        {/* TOP BENTO STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Your Products" value={stats.total} icon={<Package size={20}/>} color="emerald" trend="Database Live" />
          <StatCard title="Restock Required" value={stats.lowStock} icon={<AlertCircle size={20}/>} color="orange" trend="Critical" />
          <StatCard title="Asset Valuation" value={`₹${stats.totalValue.toLocaleString()}`} icon={<DollarSign size={20}/>} color="emerald" trend="+1.2%" />
        </div>

        {/* ADD MEDICINE FORM */}
        {showAddForm && (
          <div className="bg-white p-8 rounded-[32px] border-2 border-emerald-100 shadow-xl animate-in slide-in-from-top duration-500 relative z-20">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Plus size={24} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Register New Inventory</h2>
            </div>
            
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medicine Name</label>
                <input name="medicineName" value={formData.medicineName} onChange={handleInputChange} required
                       className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" placeholder="e.g. Paracetamol 500mg" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Batch Number</label>
                <input name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} required
                       className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold uppercase" placeholder="e.g. BT1029X" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <input name="category" value={formData.category} onChange={handleInputChange}
                       className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" placeholder="Analgesic" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                <input name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} required
                       className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                <input name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} required
                       className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" placeholder="100" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Min. Stock Alert</label>
                <input name="minStock" type="number" value={formData.minStock} onChange={handleInputChange}
                       className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleInputChange}
                       className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold" />
              </div>
              <div className="flex items-end md:col-span-1">
                <button type="submit" className="w-full py-4 bg-emerald-600 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                    <Save size={18} /> Confirm Entry
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={22} />
            <input
                type="text"
                placeholder="Search by name, category, or batch number..."
                className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-[28px] shadow-sm focus:ring-4 focus:ring-emerald-500/5 text-sm font-semibold transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>

        {/* INVENTORY TABLE */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-50">
                        <tr className="text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black">
                            <th className="px-10 py-7">Product Detail</th>
                            <th className="px-10 py-7">Batch No.</th>
                            <th className="px-10 py-7">Stock Status</th>
                            <th className="px-10 py-7">Price</th>
                            <th className="px-10 py-7">Expiry</th>
                            <th className="px-10 py-7 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr><td colSpan="6" className="py-32 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={40} /></td></tr>
                        ) : filteredInventory.length === 0 ? (
                            <tr><td colSpan="6" className="py-32 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">Database Empty</td></tr>
                        ) : filteredInventory.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                            <Pill size={22} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{item.medicineName}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{item.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        <Hash size={10} /> {item.batchNumber || '---'}
                                    </div>
                                </td>
                                <td className="px-10 py-6 min-w-[200px]">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-end">
                                            <span className={`text-[11px] font-black uppercase tracking-widest ${item.quantity <= (item.minStock || 10) ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {item.quantity} Units
                                            </span>
                                            <span className="text-[9px] text-slate-300 font-bold">Limit: {item.minStock}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${item.quantity <= (item.minStock || 10) ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${Math.min((item.quantity / 100) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-6 font-black text-slate-900 text-sm">₹{item.price?.toFixed(2)}</td>
                                <td className="px-10 py-6 text-slate-400 text-[10px] font-black uppercase">
                                    {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '---'}
                                </td>
                                <td className="px-10 py-6 text-right">
                                    <button className="p-2 text-slate-200 hover:text-slate-900 transition-colors">
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