import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import './App.css'; 
import SymptomAnalysis from './pages/SymptomAnalysis';
import Inventory from './pages/Inventory';
 import Revenue from './pages/Revenue';
import MedicineDB from './pages/MedicineDB';
import PatientDetails from './pages/PatientDetails';
import Billing from './pages/Billing'; // Assuming you have a Billing page
import Landingpage from './pages/landingpage';
import Login from './pages/login';


function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          
          <main className="flex-1 w-full overflow-y-auto bg-gray-50 px-4">
            <Routes>
              <Route path="/" element={<Landingpage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/symptom-analysis" element={<SymptomAnalysis />} />
               <Route path="/inventory" element={<Inventory />} /> 
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/medicine-db" element={<MedicineDB />} />
              <Route path="/patient-details" element={<PatientDetails />} />
              <Route path="/Billing" element={<Billing />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;