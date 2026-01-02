import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, AlertCircle, DollarSign, Search, 
  Filter, Plus, MoreHorizontal, Pill, 
  ChevronRight, Download, Loader2 
} from 'lucide-react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({ total: 1234, lowStock: 12, totalValue: 45230 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Toggle for the "Add Medicine" Section
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('/api/inventory');
        setInventory(res.data);
      } catch (err) {
        // Mock data matching your reference image for design preview
        setInventory([
          { _id: '1', name: 'Paracetamol 500mg', category: 'Pain Relief', quantity: 12, minStock: 50, price: 5.99, expiry: 'Mar 2027', supplier: 'PharmaCorp' },
          { _id: '2', name: 'Amoxicillin 250mg', category: 'Antibiotics', quantity: 85, minStock: 30, price: 12.50, expiry: 'Jun 2026', supplier: 'MediSupply' },
          { _id: '3', name: 'Ibuprofen 400mg', category: 'Pain Relief', quantity: 5, minStock: 25, price: 8.99, expiry: 'Dec 2026', supplier: 'PharmaCorp' },
          { _id: '4', name: 'Vitamin C 1000mg', category: 'Supplements', quantity: 150, minStock: 40, price: 15.00, expiry: 'Sep 2027', supplier: 'VitaHealth' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
            <p className="text-slate-500">Manage your medicine stock and supplies</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all">
                <Download size={18} /> Export
             </button>
             <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
             >
                <Plus size={20} /> Add Medicine
             </button>
          </div>
        </div>

        {/* Top Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Products" value={stats.total.toLocaleString()} icon={<Package size={20}/>} color="emerald" trend="+2.4%"/>
          <StatCard title="Low Stock Items" value={stats.lowStock} icon={<AlertCircle size={20}/>} color="orange" trend="Critical"/>
          <StatCard title="Total Value" value={`$${stats.totalValue.toLocaleString()}`} icon={<DollarSign size={20}/>} color="emerald" trend="+12%"/>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search medicines by name or category..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Filter size={18} /> Filters
            </button>
        </div>

        {/* Main Inventory Table */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-50">
                        <tr className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                            <th className="px-6 py-5">Medicine</th>
                            <th className="px-6 py-5">Category</th>
                            <th className="px-6 py-5">Stock Level</th>
                            <th className="px-6 py-5">Price</th>
                            <th className="px-6 py-5">Expiry</th>
                            <th className="px-6 py-5">Supplier</th>
                            <th className="px-6 py-5"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr><td colSpan="7" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></td></tr>
                        ) : inventory.map((item) => (
                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Pill size={18} />
                                        </div>
                                        <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-500 text-sm font-medium">{item.category}</span>
                                </td>
                                <td className="px-6 py-4 min-w-[180px]">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between text-[11px] font-bold">
                                            <span className={item.quantity <= item.minStock ? 'text-red-500' : 'text-slate-700'}>
                                                {item.quantity} units
                                            </span>
                                            <span className="text-slate-300">/ {item.minStock}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 ${item.quantity <= item.minStock ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${Math.min((item.quantity / item.minStock) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                                    ${item.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                                    {item.expiry}
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-sm font-medium">
                                    {item.supplier}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
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