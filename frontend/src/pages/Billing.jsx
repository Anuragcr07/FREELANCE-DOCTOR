import React, { useState, useEffect } from 'react';
import { 
  Search, User, Trash2, PlusCircle, MinusCircle, 
  Save, CheckCircle2, ShoppingCart, Pill, Phone, 
  Receipt, Loader2, AlertCircle, ArrowRight, Printer
} from 'lucide-react';
import Layout from '../components/Layout';
import generateInvoicePDF from '../components/generateInvoicePDF';
import axios from 'axios';

const Billing = () => {
  const [medicines, setMedicines] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const API_BASE = 'http://localhost:5000/api'; 

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/inventory`);
      setMedicines(response.data.map(med => ({
        id: med._id,
        name: med.medicineName,
        stock: med.quantity,
        price: med.price,
        category: med.category || 'General'
      })));
    } catch (err) {
      setError("System connection interrupted.");
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
  const tax = totalAmount * 0.05; // Sample 5% Tax
  const finalTotal = (totalAmount + tax).toFixed(2);

  const processTransaction = async () => {
    if (billItems.length === 0) return false;
    try {
      await axios.patch(`${API_BASE}/inventory/update-stock`, {
        billItems: billItems.map(item => ({ id: item.id, quantity: item.quantity }))
      });
      await axios.post(`${API_BASE}/transactions`, {
        items: billItems.map(item => ({ medicineId: item.id, medicineName: item.name, quantity: item.quantity, price: item.price })),
        totalAmount: parseFloat(finalTotal),
        patientName,
        phoneNumber,
      });
      return true;
    } catch (err) {
      alert("Error: " + err.message);
      return false;
    }
  };

  const handleFinish = async () => {
    const success = await processTransaction();
    if (success) {
      generateInvoicePDF({ billItems, total: finalTotal, patientName, phoneNumber });
      setBillItems([]);
      setPatientName('');
      setPhoneNumber('');
      fetchMedicines(); // Refresh stock UI
    }
  };

  if (loading) return <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
    <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Initializing Terminal</p>
  </div>;

  return (
    <Layout>
      <div className="p-8 max-w-[1500px] mx-auto">
        
        <div className="flex flex-col xl:flex-row gap-10 items-start">
          
          {/* LEFT: Inventory Selection */}
          <div className="flex-1 w-full space-y-8">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
                <p className="text-slate-400 font-medium">Build orders and manage patient billing.</p>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Station ID</p>
                <p className="text-sm font-bold text-slate-600">ST-09942</p>
              </div>
            </header>

            {/* Elite Search Bar */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={22} />
              <input
                type="text"
                placeholder="Find medicine by name, category, or barcode..."
                className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-[28px] shadow-sm shadow-slate-200/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-semibold placeholder:text-slate-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-1 items-center bg-slate-100 px-2 py-1 rounded-lg">
                <span className="text-[10px] font-black text-slate-400">⌘K</span>
              </div>
            </div>

            {/* Medicine Tiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {medicines.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((medicine) => (
                <div 
                  key={medicine.id}
                  onClick={() => handleAddMedicine(medicine)}
                  className={`p-6 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden ${
                    medicine.stock <= 0 
                    ? 'bg-slate-50 border-transparent opacity-50 grayscale cursor-not-allowed' 
                    : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 active:scale-95'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <Pill size={24} />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">In Stock</p>
                      <span className={`text-sm font-black ${medicine.stock > 10 ? 'text-emerald-500' : 'text-orange-500'}`}>
                        {medicine.stock}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 group-hover:text-emerald-700 transition-colors">{medicine.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{medicine.category}</p>
                  
                  <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                    <span className="text-xl font-black text-slate-900">₹{medicine.price.toFixed(2)}</span>
                    <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-all">
                        <PlusCircle size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: High-End Checkout Terminal */}
          <div className="w-full lg:w-[460px] lg:sticky lg:top-8 space-y-6">
            
            {/* Patient Header Section */}
            <div className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User size={16} />
                 </div>
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Assignment</h3>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sarah Jenkins" 
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Phone Contact</label>
                    <input 
                      type="tel" 
                      placeholder="+91 00000 00000" 
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
              </div>
            </div>

            {/* The Live Receipt (The Hero) */}
            <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
              {/* Animated Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-emerald-500/30 transition-all duration-700" />
              
              <div className="flex items-center justify-between mb-10 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                        <Receipt size={22} />
                    </div>
                    <h3 className="font-black text-xl tracking-tight">Summary</h3>
                </div>
                <span className="text-[10px] font-black bg-emerald-500 text-slate-900 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {billItems.length} Products
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10 mb-10">
                {billItems.length === 0 ? (
                  <div className="py-14 text-center opacity-20">
                    <ShoppingCart size={48} className="mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Terminal Empty</p>
                  </div>
                ) : (
                  billItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center group/item animate-in fade-in slide-in-from-right-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate pr-4 text-white group-hover/item:text-emerald-400 transition-colors">{item.name}</p>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">₹{item.price.toFixed(2)} / UNIT</p>
                      </div>
                      <div className="flex items-center gap-4 bg-white/5 px-3 py-1.5 rounded-2xl border border-white/5">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="text-white/30 hover:text-white transition-colors"><MinusCircle size={18}/></button>
                        <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="text-white/30 hover:text-white transition-colors"><PlusCircle size={18}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals Section */}
              <div className="border-t border-white/10 pt-8 relative z-10">
                <div className="space-y-3 mb-8">
                    <div className="flex justify-between text-[11px] font-bold text-white/40 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span className="text-white">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-white/40 uppercase tracking-widest">
                        <span>Service Fee (5%)</span>
                        <span className="text-white">₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Total Amount</span>
                        <span className="text-4xl font-black text-white">₹{finalTotal}</span>
                    </div>
                </div>

                <div className="grid gap-4">
                  <button 
                    onClick={handleFinish}
                    disabled={billItems.length === 0}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black py-5 rounded-[24px] transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-10 disabled:grayscale flex items-center justify-center gap-3 group"
                  >
                    Generate Invoice & Finalize <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex gap-3">
                    <button onClick={processTransaction} className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                       <Save size={16} /> Save
                    </button>
                    <button onClick={() => setBillItems([])} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
                       <Trash2 size={16} /> Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Billing;