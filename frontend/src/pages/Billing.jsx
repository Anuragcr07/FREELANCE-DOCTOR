import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiDollarSign,
  FiBarChart2,
  FiFileText,
  FiArchive,
  FiLink,
  FiUser,
  FiTrash2,
  FiPlusCircle,
  FiMinusCircle
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import generateInvoicePDF from '../components/generateInvoicePDF';

const Billing = () => {
  const navigate = useNavigate();
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
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const formattedData = data.map(med => ({
          id: med._id,
          name: med.medicineName,
          stock: med.quantity,
          price: med.price,
          batchNumber: med.batchNumber, 
          expiryDate: med.expiryDate,   
        }));
        setMedicines(formattedData);
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
  const handleSaveBill = () => {
    const updatedMedicines = medicines.map(med => {
                const billedItem = billItems.find(item => item.id === med.id);
                return billedItem ? { ...med, stock: med.stock - billedItem.quantity } : med;
            });
            setMedicines(updatedMedicines);
  };


  const handleGenerateBill = async () => {
    if (billItems.length === 0) {
        alert("Cannot generate a bill with no items.");
        return;
    }

    try {
            // Step 1: Update stock (this can stay the same)
            const stockUpdateResponse = await fetch('http://localhost:5000/api/inventory/update-stock', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ billItems: billItems.map(item => ({ id: item.id, quantity: item.quantity })) }),
            });
            if (!stockUpdateResponse.ok) throw new Error('Failed to update stock.');

            // ✅ Step 2: Create the transaction record in the database
            const transactionData = {
                items: billItems.map(item => ({
                    medicineId: item.id,
                    medicineName: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalAmount: parseFloat(totalAmount),
                patientName,
                phoneNumber,
            };
            
            const transactionResponse = await fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData),
            });
            if (!transactionResponse.ok) throw new Error('Failed to save the transaction.');
            
            // Step 3: Generate the PDF for the user
            generateInvoicePDF({
                billItems,
                total: totalAmount,
                patientName,
                phoneNumber,
            });

            // Step 4: Update local state to reflect changes
            const updatedMedicines = medicines.map(med => {
                const billedItem = billItems.find(item => item.id === med.id);
                return billedItem ? { ...med, stock: med.stock - billedItem.quantity } : med;
            });
            setMedicines(updatedMedicines);
            
            alert('Bill generated, stock updated, and transaction recorded! PDF is downloading.');
            
            // Step 5: Clear the bill
            setBillItems([]);
            setPatientName('');
            setPhoneNumber('');

        } catch (err) {
            setError(err.message);
            alert('Error generating bill: ' + err.message);
        }
        // --- End of updated logic ---
    };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = billItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  if (loading) return <div className="p-8 text-center text-lg">Loading medicines...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-500">Error: {error}</div>;

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      <Header />

      <nav className="px-4 pt-4">
          <div className="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2 overflow-x-auto">
            <button className="flex items-center justify-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100" onClick={() => navigate('/')}>
              <FiBarChart2 className="mr-2" /> Dashboard
            </button>
            <button className="flex items-center justify-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100" onClick={() => navigate('/symptom-analysis')}>
              <FiFileText className="mr-2" /> Symptom Analysis
            </button>
            <button className="flex items-center justify-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100" onClick={() => navigate('/inventory')}>
              <FiArchive className="mr-2" /> Inventory
            </button>
            <button className="flex items-center justify-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100" onClick={() => navigate('/revenue')}>
              <FiDollarSign className="mr-2" /> Revenue
            </button>
            <button className="flex items-center justify-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100" onClick={() => navigate('/medicine-db')}>
              <FiLink className="mr-2" /> Medicine DB
            </button>
            <button className="flex items-center justify-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100" onClick={() => navigate('/patient-details')}>
                  <FiUser className="mr-2" /> Patient Details
              </button>
            <button className="flex items-center justify-center w-full px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100" onClick={() => navigate('/billing')}>
              <FiDollarSign className="mr-2" /> Billing
            </button>
          </div>
      </nav>

      <main className="p-4 space-y-6">          
        <section className="bg-white p-6 rounded-lg shadow-sm">
           <div className="flex items-center mb-6">
              <FiArchive className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-800">Available Medicines</h2>
                <p className="text-gray-500">Search and add medicines to the current bill.</p>
              </div>
            </div>
            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for a medicine..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map((medicine) => (
              <div key={medicine.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center transition-shadow hover:shadow-md">
                <div>
                  <p className="font-bold text-gray-800">{medicine.name}</p>
                  <p className="text-sm text-gray-600">₹{medicine.price.toFixed(2)}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${medicine.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Stock: {medicine.stock}
                  </span>
                </div>
                <button
                  onClick={() => handleAddMedicine(medicine)}
                  disabled={medicine.stock <= 0}
                  className="bg-blue-500 text-black font-bold rounded-lg h-10 w-20 flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  ADD
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-6">
                    <FiUser className="h-6 w-6 text-gray-500 mr-3" />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Patient Info</h2>
                        <p className="text-gray-500">Enter patient details (optional).</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                        <input type="text" id="patientName" placeholder="Enter patient name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="text" id="phoneNumber" placeholder="Enter phone number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                </div>
            </section>
            
            <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-6">
                <FiFileText className="h-6 w-6 text-green-600 mr-3" />
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Current Bill</h2>
                    <p className="text-gray-500">Review items before finalizing.</p>
                </div>
              </div>
              {billItems.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No items added to the bill yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {billItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} per unit</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-gray-700">
                          <FiMinusCircle size={20} />
                        </button>
                        <span className="font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-gray-700">
                          <FiPlusCircle size={20} />
                        </button>
                        <button onClick={() => handleRemoveItem(item.id)} className="ml-2 text-red-500 hover:text-red-700">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t-2 border-gray-200 pt-4 mt-6">
                    <div className="flex justify-between items-center font-bold text-xl text-gray-800">
                      <span>Total Amount:</span>
                      <span className="text-green-600">₹{totalAmount}</span>
                    </div>
                    <button 
                        onClick={handleGenerateBill}
                        className="w-full mt-6 flex items-center justify-center px-6 py-4 text-lg font-semibold text-black bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        <FiDollarSign className="mr-2" /> Generate Bill & Download PDF
                    </button>
                    <button onClick={handleSaveBill}>
                      SAVE
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