import React, { useState, useEffect } from 'react';
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

  const [medicines, setMedicines] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for patient info
  const [patientName, setPatientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch medicines from the API when the component mounts
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        // Use the correct endpoint from your backend
        const response = await fetch('http://localhost:5000/api/inventory');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Map backend data to frontend state structure
        // Mongoose uses `_id` and your schema has `medicineName` and `quantity`
        const formattedData = data.map(med => ({
          id: med._id, // Map _id to id
          name: med.medicineName, // Map medicineName to name
          stock: med.quantity, // Map quantity to stock
          price: med.price,
        }));
        setMedicines(formattedData);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleAddMedicine = (medicine) => {
    // Check against the available stock
    if (medicine.stock <= 0) {
      alert(`${medicine.name} is out of stock.`);
      return;
    }

    setBillItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === medicine.id);
      if (existingItem) {
        // Prevent adding more than what's in stock
        if (existingItem.quantity < medicine.stock) {
          return prevItems.map((item) =>
            item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          alert(`Cannot add more ${medicine.name}. Only ${medicine.stock} left in stock.`);
          return prevItems;
        }
      } else {
        return [...prevItems, { ...medicine, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (itemId) => {
    setBillItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const medicineInStock = medicines.find((m) => m.id === itemId);

    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
    } else if (newQuantity > medicineInStock.stock) {
      alert(`Cannot set quantity for ${medicineInStock.name} to ${newQuantity}. Only ${medicineInStock.stock} left in stock.`);
    } else {
      setBillItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleGenerateBill = async () => {
    if (billItems.length === 0) {
        alert("Cannot generate a bill with no items.");
        return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/inventory/update-stock', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billItems }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update stock');
      }

      const updatedMedicines = medicines.map(med => {
        const billedItem = billItems.find(item => item.id === med.id);
        if (billedItem) {
          return { ...med, stock: med.stock - billedItem.quantity };
        }
        return med;
      });
      setMedicines(updatedMedicines);

      alert('Bill generated and stock updated successfully!');
      
      setBillItems([]);
      setPatientName('');
      setPhoneNumber('');

    } catch (error) {
      setError(error.message);
      alert('Error generating bill: ' + error.message);
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = billItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  if (loading) return <div className="p-8 text-center text-lg">Loading medicines from the database...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-500">Error: {error}</div>;

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
                <button className="flex items-center justify-center w-full px-4 py-2 text-white bg-slate-800 rounded-md" onClick={() => navigate('/medicine-db')}>
                  <FiLink className="mr-2" /> Medicine DB
                </button>
                 <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/patient-details')}>
                                        <FiLink className="mr-2" /> Patient Details
                                    </button>
                <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/billing')}>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedicines.map((medicine) => (
                <div key={medicine.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{medicine.name}</p>
                    <p className="text-sm text-slate-600">₹{medicine.price.toFixed(2)} • <span className={medicine.stock > 10 ? 'text-green-600' : 'text-red-600'}>Stock: {medicine.stock}</span></p>
                  </div>
                  <button
                    onClick={() => handleAddMedicine(medicine)}
                    // Disable button if medicine is out of stock
                    disabled={medicine.stock <= 0}
                    className="bg-blue-500 text-black font-bold rounded-lg h-10 w-20 flex items-center justify-center hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    ADD
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
                        <p className="text-slate-500">Enter patient details (optional)</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                        <input type="text" id="patientName" placeholder="Enter patient name" className="w-full px-4 py-2 border border-slate-300 rounded-lg" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                        <input type="text" id="phoneNumber" placeholder="Enter phone number" className="w-full px-4 py-2 border border-slate-300 rounded-lg" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
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
                <div className="text-center py-10">
                    <p className="text-slate-500">No items added to the bill yet.</p>
                </div>
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
                    <button 
                        onClick={handleGenerateBill}
                        className="w-full mt-6 flex items-center justify-center px-6 py-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
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