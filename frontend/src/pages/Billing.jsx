import React, { useState, useEffect } from 'react';
import { 
  Search, User, Trash2, PlusCircle, MinusCircle, 
  Save, CheckCircle2, ShoppingCart, Pill, Phone, 
  Receipt, Loader2, AlertCircle, ArrowRight, Settings, Percent, Landmark
} from 'lucide-react';
import Layout from '../components/Layout';
import generateInvoicePDF from '../components/generateInvoicePDF';
import API from '../services/api'; 

const Billing = () => {
  const [medicines, setMedicines] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);

  const [storeInfo, setStoreInfo] = useState({
    name: 'ARTI MEDICINE HOUSE',
    address: '1/005 SHOP NO-2 GROUND FLOOR, VINARM KHAND-1, GOMTI NAGAR',
    phone: '6392143413',
    email: 'aman7459800883@gmail.com',
    gstin: '09DABCU9527B1Z6',
    dlNo: 'UP32200007724, UP32210007720'
  });

  const [showStoreSettings, setShowStoreSettings] = useState(false);

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
        category: med.category || 'General',
        batchNumber: med.batchNumber,
        expiryDate: med.expiryDate
      })));
    } catch (err) { console.error("Sync error"); }
    finally { setLoading(false); }
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

  const subTotal = billItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = subTotal * (discountPercent / 100);
  const taxableAmount = subTotal - discountAmount;
  const taxAmount = taxableAmount * (taxPercent / 100);
  const finalTotal = (taxableAmount + taxAmount).toFixed(2);

  const processTransaction = async () => {
    if (billItems.length === 0) return false;
    try {
      await API.patch('/inventory/update-stock', {
        billItems: billItems.map(item => ({ id: item.id, quantity: item.quantity }))
      });
      await API.post('/transactions', {
        items: billItems.map(item => ({ medicineId: item.id, medicineName: item.name, quantity: item.quantity, price: item.price })),
        totalAmount: parseFloat(finalTotal),
        patientName: patientName || 'Walk-in',
        phoneNumber: phoneNumber || 'N/A',
      });
      return true;
    } catch (err) {
      alert("Database Sync Error");
      return false;
    }
  };

  const handleFinish = async () => {
    const success = await processTransaction();
    if (success) {
      generateInvoicePDF({ billItems, subTotal, discountPercent, taxPercent, total: finalTotal, patientName, phoneNumber, storeInfo });
      resetBilling();
      alert("Bill Generated and PDF Downloaded!");
    }
  };

  const handleSaveOnly = async () => {
    const success = await processTransaction();
    if (success) {
      resetBilling();
      alert("Record Saved Successfully!");
    }
  };

  const resetBilling = () => {
    setBillItems([]);
    setPatientName('');
    setPhoneNumber('');
    fetchMedicines();
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={40}/></div>;

  return (
    <Layout>
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col xl:flex-row gap-10 items-start text-slate-900">
          
          {/* LEFT SECTION */}
          <div className="flex-1 w-full space-y-8">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-black tracking-tight">Billing Terminal</h1>
                <p className="text-slate-400 font-medium">{storeInfo.name}</p>
              </div>
              <button onClick={() => setShowStoreSettings(!showStoreSettings)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all">
                <Settings size={20} />
              </button>
            </header>

            {showStoreSettings && (
              <div className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4">
                <input placeholder="Store Name" className="p-3 rounded-xl bg-white text-sm font-bold shadow-sm" value={storeInfo.name} onChange={e => setStoreInfo({...storeInfo, name: e.target.value})} />
                <input placeholder="Phone" className="p-3 rounded-xl bg-white text-sm font-bold shadow-sm" value={storeInfo.phone} onChange={e => setStoreInfo({...storeInfo, phone: e.target.value})} />
                <input placeholder="Email" className="p-3 rounded-xl bg-white text-sm font-bold shadow-sm" value={storeInfo.email} onChange={e => setStoreInfo({...storeInfo, email: e.target.value})} />
                <input placeholder="GSTIN" className="p-3 rounded-xl bg-white text-sm font-bold shadow-sm" value={storeInfo.gstin} onChange={e => setStoreInfo({...storeInfo, gstin: e.target.value})} />
                <input placeholder="DL No" className="p-3 rounded-xl bg-white text-sm font-bold shadow-sm" value={storeInfo.dlNo} onChange={e => setStoreInfo({...storeInfo, dlNo: e.target.value})} />
                <input placeholder="Address" className="p-3 rounded-xl bg-white text-sm font-bold shadow-sm" value={storeInfo.address} onChange={e => setStoreInfo({...storeInfo, address: e.target.value})} />
              </div>
            )}

            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={22} />
              <input type="text" placeholder="Search medicines..." className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-[28px] shadow-sm focus:ring-4 focus:ring-emerald-500/5 text-sm font-semibold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {medicines.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).map((medicine) => (
                <div key={medicine.id} onClick={() => handleAddMedicine(medicine)} className="p-6 rounded-[32px] border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xl transition-all cursor-pointer active:scale-95 group">
                   <div className="flex justify-between mb-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all"><Pill size={20} /></div>
                    <span className="text-[10px] font-black text-slate-300 uppercase">{medicine.stock} Left</span>
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{medicine.name}</h3>
                  <div className="flex items-center justify-between mt-6 border-t border-slate-50 pt-4">
                    <span className="text-xl font-black">₹{medicine.price.toFixed(2)}</span>
                    <PlusCircle size={20} className="text-slate-200 group-hover:text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full lg:w-[460px] lg:sticky lg:top-8 space-y-6">
            <div className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><User size={14}/> Assignment</h3>
                <div className="space-y-3">
                    <input placeholder="Patient Name" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold" value={patientName} onChange={e => setPatientName(e.target.value)} />
                    <input placeholder="Phone Number" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                </div>
              </div>

              <div className="border-t border-slate-50 pt-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Landmark size={14}/> Adjustments</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Manual GST (%)</label>
                        <input type="number" className="w-full px-4 py-3 bg-slate-100/50 rounded-xl text-sm font-bold" value={taxPercent} onChange={e => setTaxPercent(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Discount (%)</label>
                        <input type="number" className="w-full px-4 py-3 bg-slate-100/50 rounded-xl text-sm font-bold" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} />
                    </div>
                </div>
              </div>
            </div>

            {/* DARK RECEIPT */}
            <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
              <h3 className="font-black text-xl mb-10 flex items-center gap-2 relative z-10 text-white"><Receipt size={22} className="text-emerald-400" /> Summary</h3>

              <div className="space-y-6 max-h-[250px] overflow-y-auto pr-2 relative z-10 mb-10">
                {billItems.map(item => (
                   <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate pr-4 text-white">{item.name}</p>
                        <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">₹{item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                      {/* FIXED: Plus/Minus Buttons turned BLACK (Slate-900) */}
                      <div className="flex items-center gap-3 bg-white/10 px-2 py-1.5 rounded-2xl border border-white/5 shadow-inner">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="text-slate-900 bg-white/80 hover:bg-white rounded-lg p-0.5"><MinusCircle size={18}/></button>
                        <span className="text-sm font-black w-4 text-center text-white">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="text-slate-900 bg-white/80 hover:bg-white rounded-lg p-0.5"><PlusCircle size={18}/></button>
                      </div>
                   </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-8 relative z-10 space-y-3 mb-10">
                  <div className="flex justify-between text-[11px] font-bold text-white/30 uppercase tracking-widest"><span>Subtotal</span><span>₹{subTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[11px] font-bold text-red-400 uppercase tracking-widest"><span>Discount</span><span>- ₹{discountAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[11px] font-bold text-white/30 uppercase tracking-widest"><span>Manual GST</span><span>+ ₹{taxAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between items-end pt-4"><span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Final Amount</span><span className="text-4xl font-black text-white">₹{finalTotal}</span></div>
              </div>

              <div className="grid gap-3 relative z-10">
                <button onClick={handleFinish} disabled={billItems.length === 0} className="w-full bg-emerald-500 text-slate-900 font-black py-5 rounded-[24px] shadow-xl hover:bg-emerald-400 active:scale-95 disabled:opacity-10 transition-all flex items-center justify-center gap-3">
                  Print Invoice & Sync <ArrowRight size={20} />
                </button>
                <div className="flex gap-3">
                    <button onClick={handleSaveOnly} disabled={billItems.length === 0} className="flex-1 bg-white/5 hover:bg-white/10 text-black text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all disabled:opacity-20 flex items-center justify-center gap-2"><Save size={14}/> Save</button>
                    <button onClick={() => setBillItems([])} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all flex items-center justify-center gap-2"><Trash2 size={14}/> Clear</button>
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