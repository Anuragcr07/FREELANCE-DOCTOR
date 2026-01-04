import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  BookOpen, Search, Tag, Pill, AlertCircle, 
  Plus, ShieldAlert, Loader2, FlaskConical, 
  PackageCheck, Info
} from 'lucide-react';
import Layout from '../components/Layout';

const MedicineDB = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedicines = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = searchQuery
        ? `/api/medicines/search?q=${encodeURIComponent(searchQuery)}`
        : '/api/medicines/';
      const response = await axios.get(url);
      setMedicines(response.data);
    } catch (err) {
      setError('Database sync failed. Please refresh.');
      // Mock data for design preview
      setMedicines([
        { _id: '1', medicineName: 'Paracetamol 500mg', manufacturer: 'GSK Pharma', price: 12.50, quantity: 45, minStock: 20, category: 'Analgesic', indications: 'Fever and pain relief', isRx: false },
        { _id: '2', medicineName: 'Amoxicillin 250mg', manufacturer: 'Pfizer Inc', price: 180.00, quantity: 8, minStock: 25, category: 'Antibiotic', indications: 'Bacterial infections', isRx: true },
        { _id: '3', medicineName: 'Cetirizine 10mg', manufacturer: 'Cipla Ltd', price: 45.20, quantity: 0, minStock: 10, category: 'Antihistamine', indications: 'Allergic rhinitis', isRx: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(fetchMedicines, 300);
    return () => clearTimeout(timer);
  }, [fetchMedicines]);

  const handleRestock = async (id, medicineName) => {
    const quantityStr = prompt(`Add stock for ${medicineName}:`);
    if (!quantityStr) return;
    const quantityToAdd = parseInt(quantityStr, 10);
    if (isNaN(quantityToAdd) || quantityToAdd <= 0) return;

    try {
      await axios.patch(`/api/medicines/${id}/restock`, { quantityToAdd });
      fetchMedicines();
    } catch (err) {
      alert("Update failed.");
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header & Quick Insights */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
               <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                  <BookOpen size={22} />
               </div>
               Medicine Database
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Browse and manage the master pharmacy inventory.</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total SKU</p>
                <p className="text-lg font-bold text-slate-800">{medicines.length}</p>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Critical</p>
                <p className="text-lg font-bold text-red-500">
                  {medicines.filter(m => m.quantity <= m.minStock).length}
                </p>
            </div>
          </div>
        </div>

        {/* Elite Search Bar */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, category, or symptoms..."
            className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[24px] shadow-sm shadow-slate-200/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-semibold placeholder:text-slate-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-slate-100 px-2 py-1 rounded-lg">
             <span className="text-[10px] font-black text-slate-400">⌘K</span>
          </div>
        </div>

        {/* Medicine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-20 text-center">
               <Loader2 className="animate-spin mx-auto text-emerald-500 mb-4" size={32} />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Syncing Records...</p>
            </div>
          ) : medicines.map(med => (
            <div 
              key={med._id} 
              className="bg-white rounded-[32px] border border-slate-100 p-7 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-11 h-11 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <FlaskConical size={20} />
                   </div>
                   <div>
                      <h3 className="text-base font-black text-slate-800 leading-tight">{med.medicineName}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{med.manufacturer}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900">₹{med.price?.toFixed(2)}</p>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                    med.quantity > med.minStock 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : med.quantity > 0
                      ? 'bg-orange-50 text-orange-600'
                      : 'bg-red-50 text-red-600'
                  }`}>
                    {med.quantity > 0 ? `${med.quantity} Units` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {med.indications && (
                   <div className="flex items-start gap-2">
                      <Info size={14} className="text-slate-300 mt-0.5" />
                      <p className="text-xs text-slate-500 leading-relaxed italic">"{med.indications}"</p>
                   </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                   <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                      <Tag size={12} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{med.category || 'General'}</span>
                   </div>
                   {med.isRx && (
                     <div className="inline-flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                        <ShieldAlert size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight">Prescription Required</span>
                     </div>
                   )}
                </div>
              </div>

              <button
                  onClick={() => handleRestock(med._id, med.medicineName)}
                  className="w-full py-3.5 bg-slate-50 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-500/10 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                  <Plus size={16} /> Update Stock
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default MedicineDB;