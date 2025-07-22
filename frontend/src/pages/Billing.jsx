import React, { useState } from 'react';
import { 
  FiSearch, 
  FiDollarSign, 
  FiBarChart2, 
  FiFileText, 
  FiArchive, 
  FiLink, 
  FiUser,
  FiPlus,
  FiTrash2
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Assuming Header is a shared component

const Billing = () => {
  const navigate = useNavigate();
  
  // Mock data for available medicines - in a real app, this would be fetched from an API
  const [medicines] = useState([
    { id: 1, name: 'Paracetamol 500mg', price: 12.50, stock: 150 },
    { id: 2, name: 'Amoxicillin 250mg', price: 45.00, stock: 8 },
    { id: 3, name: 'Aspirin 75mg', price: 8.75, stock: 200 },
    { id: 4, name: 'Ibuprofen 400mg', price: 18.25, stock: 45 },
  ]);

  const [billItems, setBillItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddMedicine = (medicine) => {
    setBillItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === medicine.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...medicine, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (itemId) => {
    setBillItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setBillItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = billItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

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
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100 bg-slate-100" onClick={() => navigate('/billing')}>
            <FiDollarSign className="mr-2" /> Billing
          </button>
        </div>
      </nav>

      <main className="p-4 space-y-6">
        
        {/* Available Medicines Section */}
        <section className="bg-white p-8 rounded-lg shadow-sm">
           <div className="mb-6">
              <div className="flex items-center mb-2">
                <FiArchive className="h-7 w-7 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-slate-800">Available Medicines</h2>
              </div>
              <p className="text-slate-500">Search and add medicines to the current bill</p>
            </div>
            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search for a medicine..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMedicines.map((medicine) => (
                <div key={medicine.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{medicine.name}</p>
                    <p className="text-sm text-slate-600">₹{medicine.price.toFixed(2)} • <span className="text-green-600">Stock: {medicine.stock}</span></p>
                  </div>
                  <button
                    onClick={() => handleAddMedicine(medicine)}
                    className="bg-blue-500 text-black rounded-lg h-10 w-10 flex items-center justify-center hover:bg-blue-600"
                  >
                    ADD
                    <FiPlus size={20} className="text-blue-500" />
                  </button>
                </div>
              ))}
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Information Section */}
            <section className="lg:col-span-1 bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center mb-6">
                    <FiUser className="h-7 w-7 text-slate-500 mr-3" />
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Patient Info</h2>
                        <p className="text-slate-500">Enter patient details</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                        <input type="text" id="patientName" placeholder="Enter patient name" className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <input type="text" id="phoneNumber" placeholder="Enter phone number" className="w-full px-4 py-2 border border-slate-300 rounded-lg"/>
                    </div>
                </div>
            </section>
            
            {/* Current Bill Section */}
            <section className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-6">
                <FiFileText className="h-7 w-7 text-green-600 mr-3" />
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Current Bill</h2>
                    <p className="text-slate-500">Review items before finalising</p>
                </div>
              </div>
              {billItems.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No items added to the bill yet.</p>
              ) : (
                <div className="space-y-4">
                  {billItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-sm text-slate-600">₹{item.price.toFixed(2)} per unit</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="bg-slate-200 text-slate-700 rounded-full h-7 w-7 flex items-center justify-center hover:bg-slate-300">-</button>
                        <span className="font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="bg-slate-200 text-slate-700 rounded-full h-7 w-7 flex items-center justify-center hover:bg-slate-300">+</button>
                        <button onClick={() => handleRemoveItem(item.id)} className="ml-2 text-red-500 hover:text-red-700">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t-2 border-slate-200 pt-4 mt-6">
                    <div className="flex justify-between items-center font-bold text-xl text-slate-800">
                      <span>Total Amount:</span>
                      <span className="text-green-600">₹{totalAmount}</span>
                    </div>
                    <button className="w-full mt-6 flex items-center justify-center px-6 py-4 text-lg font-semibold text-black bg-slate-800 rounded-lg hover:bg-slate-900">
                        <FiDollarSign className="mr-2" /> Generate & Print Bill
                    </button>
                  </div>
                </div>
              )}
            </section>
        </div>
      </main>
    </div>
  );
};

export default Billing;