import React, { useState, useEffect } from 'react';
import { 
  Search, User, Trash2, PlusCircle, MinusCircle, 
  Save, CheckCircle2, ShoppingCart, Pill, Phone, 
  Receipt, Loader2, AlertCircle, ArrowRight, ShieldCheck
} from 'lucide-react';
import Layout from '../components/Layout';
import generateInvoicePDF from '../components/generateInvoicePDF';
import API from '../services/api'; 

const Billing = () => {
  const [medicines, setMedicines] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await API.get('/inventory');
      setMedicines(response.data.map(med => ({
        id: med._id,
        name: med.medicineName,
        stock: med.quantity,
        price: med.price,
        category: med.category || 'General Pharma'
      })));
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Session expired or server connection lost.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = (medicine) => {
    if (medicine.stock <= 0) return;
    setBillItems((prev) => {
      const existing = prev.find(item => item.id === medicine.id);
      if (existing) {
        if (existing.quantity < medicine.stock) {
          return prev.map(item => item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return prev;
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId, newQty) => {
    const med = medicines.find(m => m.id === itemId);
    if (newQty <= 0) {
      setBillItems(prev => prev.filter(i => i.id !== itemId));
    } else if (newQty <= med.stock) {
      setBillItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: newQty } : i));
    }
  };

  const totalAmount = billItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = totalAmount * 0.05; 
  const finalTotal = (totalAmount + tax).toFixed(2);

  // Core Logic: Communicates with Backend
  const processTransaction = async () => {
    if (billItems.length === 0) {
        alert("Please add items to the bill first.");
        return false;
    }
    try {
      // 1. Update Stock in Inventory
      await API.patch('/inventory/update-stock', {
        billItems: billItems.map(item => ({ id: item.id, quantity: item.quantity }))
      });

      // 2. Record Transaction
      await API.post('/transactions', {
        items: billItems.map(item => ({ 
            medicineId: item.id, 
            medicineName: item.name, 
            quantity: item.quantity, 
            price: item.price 
        })),
        totalAmount: parseFloat(finalTotal),
        patientName: patientName || 'Walk-in Customer',
        phoneNumber: phoneNumber || 'N/A',
      });

      return true;
    } catch (err) {
      console.error("Transaction failed", err);
      alert("Terminal Error: " + (err.response?.data?.message || "Check your network."));
      return false;
    }
  };

  // Action: Finalize with PDF
  const handleFinish = async () => {
    const success = await processTransaction();
    if (success) {
      generateInvoicePDF({ billItems, total: finalTotal, patientName, phoneNumber });
      alert("Order Processed & Invoice Generated!");
      resetUI();
    }
  };

  // Action: Save to DB only (Draft Mode)
  const handleSaveOnly = async () => {
    const success = await processTransaction();
    if (success) {
      alert("Stock and Revenue records updated successfully!");
      resetUI();
    }
  };

  const resetUI = () => {
    setBillItems([]);
    setPatientName('');
    setPhoneNumber('');
    fetchMedicines(); // Refresh stock status in the list
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Secure Terminal</p>
    </div>
  );

  return (
    <Layout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-10 items-start">
          
          {/* LEFT: Selection Grid */}
          <div className="flex-1 w-full space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Billing Terminal</h1>
                <p className="text-slate-400 font-medium">Add medicines from your inventory.</p>
              </div>
            </header>

            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={22} />
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-[28px] shadow-sm focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-semibold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {medicines.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((medicine) => (
                <div 
                  key={medicine.id}
                  onClick={() => handleAddMedicine(medicine)}
                  className={`p-6 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden ${
                    medicine.stock <= 0 ? 'bg-slate-50 opacity-40 grayscale cursor-not-allowed' : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 active:scale-95'
                  }`}
                >
                  <div className="flex justify-between mb-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Pill size={20} />
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${medicine.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-500'}`}>
                        {medicine.stock} Left
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{medicine.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{medicine.category}</p>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-2">
                    <span className="text-xl font-black text-slate-900">₹{medicine.price.toFixed(2)}</span>
                    <PlusCircle size={20} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Receipt Panel */}
          <div className="w-full lg:w-[460px] lg:sticky lg:top-8 space-y-6">
            <div className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                <User size={14} /> Assignment
              </h3>
              <div className="space-y-4">
                <input type="text" placeholder="Patient Name" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                <input type="tel" placeholder="Contact Number" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
            </div>

            <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
              
              <h3 className="font-black text-xl mb-10 flex items-center gap-2 relative z-10">
                <Receipt size={22} className="text-emerald-400" /> Order Summary
              </h3>

              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10 mb-10">
                {billItems.length === 0 ? (
                  <div className="py-20 text-center opacity-20 flex flex-col items-center">
                    <ShoppingCart size={48} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Cart Empty</p>
                  </div>
                ) : (
                  billItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center animate-in fade-in slide-in-from-right-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate pr-4">{item.name}</p>
                        <p className="text-[10px] text-white/30 font-bold tracking-widest uppercase">₹{item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/5">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="text-white/30 hover:text-white"><MinusCircle size={18}/></button>
                        <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="text-white/30 hover:text-white"><PlusCircle size={18}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
                <div className="flex justify-between items-end mb-10">
                  <span className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Total Payable</span>
                  <span className="text-4xl font-black text-emerald-400">₹{finalTotal}</span>
                </div>

                <div className="grid gap-4">
                  <button 
                    onClick={handleFinish}
                    disabled={billItems.length === 0}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-5 rounded-[24px] shadow-xl shadow-emerald-500/30 active:scale-95 disabled:opacity-10 flex items-center justify-center gap-3 transition-all"
                  >
                    Generate & Sync <ArrowRight size={20} />
                  </button>
                  <div className="flex gap-3">
                    <button onClick={handleSaveOnly} disabled={billItems.length === 0} className="flex-1 bg-white/5 hover:bg-white/10 text-blue-900 text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl transition-all disabled:opacity-20">
                       Save Record
                    </button>
                    <button onClick={() => setBillItems([])} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl transition-all">
                       Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center justify-center gap-2">
               <AlertCircle size={12} className="text-emerald-500" /> Secure Cloud Transmission
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Billing;