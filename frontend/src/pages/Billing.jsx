import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiDollarSign,
  FiFileText,
  FiArchive,
  FiUser,
  FiTrash2,
  FiPlusCircle,
  FiMinusCircle,
  FiSave
} from 'react-icons/fi';
import Layout from '../components/Layout';
import generateInvoicePDF from '../components/generateInvoicePDF';

const Billing = () => {
  const [medicines, setMedicines] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/inventory');
        if (!response.ok) throw new Error('Failed to fetch inventory.');
        const data = await response.json();
        setMedicines(data.map(med => ({
          id: med._id,
          name: med.medicineName,
          stock: med.quantity,
          price: med.price,
        })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const handleAddMedicine = (medicine) => {
    if (medicine.stock <= 0) {
      alert(`${medicine.name} is out of stock.`);
      return;
    }
    setBillItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === medicine.id);
      if (existingItem) {
        if (existingItem.quantity < medicine.stock) {
          return prevItems.map((item) =>
            item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        alert(`Cannot add more ${medicine.name}. Only ${medicine.stock} left in stock.`);
        return prevItems;
      }
      return [...prevItems, { ...medicine, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const medicineInStock = medicines.find((m) => m.id === itemId);
    if (newQuantity <= 0) {
      setBillItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } else if (newQuantity > medicineInStock.stock) {
      alert(`Only ${medicineInStock.stock} units of ${medicineInStock.name} are available.`);
    } else {
      setBillItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleClearBill = () => {
    setBillItems([]);
  };

 

  const handleLoadBill = () => {
    const storedBillItems = localStorage.getItem('billItems');
    if (storedBillItems) {
      setBillItems(JSON.parse(storedBillItems));
    }
  };

  const handleGenerateBill = async () => {
    if (billItems.length === 0) {
      alert("The bill is empty. Please add items before generating.");
      return;
    }
    try {
      await fetch('http://localhost:5000/api/inventory/update-stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billItems: billItems.map(item => ({ id: item.id, quantity: item.quantity })) }),
      });
      await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: billItems.map(item => ({ medicineId: item.id, medicineName: item.name, quantity: item.quantity, price: item.price })),
          totalAmount: parseFloat(totalAmount),
          patientName,
          phoneNumber,
        }),
      });
      generateInvoicePDF({ billItems, total: totalAmount, patientName, phoneNumber });

      const updatedMedicines = medicines.map(med => {
        const billedItem = billItems.find(item => item.id === med.id);
        return billedItem ? { ...med, stock: med.stock - billedItem.quantity } : med;
      });
      setMedicines(updatedMedicines);

      alert('Bill generated successfully! The PDF is downloading.');
      setBillItems([]);
      setPatientName('');
      setPhoneNumber('');
    } catch (err) {
      setError(err.message);
      alert('Error generating bill: ' + err.message);
    }
  };

  // NEW: Save stock & revenue only
  // New function to update stock & revenue only
const handleSaveStockAndRevenue = async () => {
  if (billItems.length === 0) {
    alert("No items in the bill to save.");
    return;
  }

  try {
    // 1. Update stock
    await fetch("http://localhost:5000/api/inventory/update-stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        billItems: billItems.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      }),
    });

    // 2. Update revenue
   await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: billItems.map(item => ({ medicineId: item.id, medicineName: item.name, quantity: item.quantity, price: item.price })),
          totalAmount: parseFloat(totalAmount),
          patientName,
          phoneNumber,
      }),
    });

    // 3. Update local medicines state instantly
    const updatedMedicines = medicines.map(med => {
      const billedItem = billItems.find(item => item.id === med.id);
      return billedItem ? { ...med, stock: med.stock - billedItem.quantity } : med;
    });
    setMedicines(updatedMedicines);

    alert("Stock and revenue updated successfully!");
     setBillItems([]);
      setPatientName('');
      setPhoneNumber('');
  } catch (err) {
    alert("Error saving stock and revenue: " + err.message);
  }
};


  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = billItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  if (loading) return <Layout><div className="text-center p-8">Loading...</div></Layout>;
  if (error) return <Layout><div className="text-center p-8 text-red-500">Error: {error}</div></Layout>;

  return (
    <Layout>
      <main className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-6">
            <FiArchive className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-slate-800">Available Medicines</h2>
              <p className="text-slate-500">Search and add medicines to the current bill.</p>
            </div>
          </div>
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for a medicine to add to the bill..."
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map((medicine) => (
              <div key={medicine.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center transition-shadow hover:shadow-md">
                <div>
                  <p className="font-bold text-slate-800">{medicine.name}</p>
                  <p className="text-sm text-slate-600">₹{medicine.price.toFixed(2)}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${medicine.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    Stock: {medicine.stock}
                  </span>
                </div>
                <button
                  onClick={() => handleAddMedicine(medicine)}
                  disabled={medicine.stock <= 0}
                  className="bg-blue-500 text-black font-bold rounded-lg h-10 w-20 flex items-center justify-center hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-6">
              <FiUser className="h-6 w-6 text-slate-500 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">Patient Info</h2>
                <p className="text-slate-500">Enter details for the invoice (optional).</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                <input type="text" id="patientName" placeholder="e.g., John Doe" className="w-full px-4 py-2 border border-slate-300 rounded-lg" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input type="tel" id="phoneNumber" placeholder="e.g., 9876543210" className="w-full px-4 py-2 border border-slate-300 rounded-lg" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
            </div>
          </section>

          <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-6">
              <FiFileText className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">Current Bill</h2>
                <p className="text-slate-500">Review items before finalizing the transaction.</p>
              </div>
            </div>
            {billItems.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg">
                <p className="text-slate-500">No items have been added to the bill.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {billItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-600">₹{item.price.toFixed(2)} / unit</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="text-slate-500 hover:text-red-600 p-1 rounded-full"><FiMinusCircle size={20} /></button>
                      <span className="font-semibold w-5 text-center">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="text-slate-500 hover:text-green-600 p-1 rounded-full"><FiPlusCircle size={20} /></button>
                      <button onClick={() => setBillItems(prev => prev.filter(i => i.id !== item.id))} className="ml-2 text-red-500 hover:text-red-700"><FiTrash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                <div className="border-t-2 border-slate-200 pt-4 mt-6">
                  <div className="flex justify-between items-center font-bold text-xl text-slate-800">
                    <span>Total:</span>
                    <span className="text-green-600">₹{totalAmount}</span>
                  </div>
                  <button
                    onClick={handleGenerateBill}
                    className="w-full mt-6 flex items-center justify-center px-6 py-3 text-lg font-semibold text-black bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <FiDollarSign className="mr-2" /> Generate Bill & Finalize
                  </button>
                  <button
                    onClick={handleClearBill}
                    className="w-full mt-4 flex items-center justify-center px-6 py-3 text-lg font-semibold text-black bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    <FiTrash2 className="mr-2" /> Clear Bill
                  </button>
                
                  <button
                    onClick={handleSaveStockAndRevenue}
                    className="w-full mt-4 flex items-center justify-center px-6 py-3 text-lg font-semibold text-black bg-yellow-500 rounded-lg hover:bg-yellow-600"
                  >
                    <FiSave className="mr-2" /> Save Stock & Revenue
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
};

export default Billing;
