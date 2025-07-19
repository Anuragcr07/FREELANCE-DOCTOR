import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './App.css'; // Assuming you have a CSS file for global styles
// Import other pages as you create them
import SymptomAnalysis from './pages/SymptomAnalysis';
import Inventory from './pages/Inventory';
 import Revenue from './pages/Revenue';
import MedicineDB from './pages/MedicineDB';

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col">
          
          <main className="flex-1 w-full overflow-y-auto bg-gray-50 px-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* Add routes for other pages here */}
              <Route path="/symptom-analysis" element={<SymptomAnalysis />} />
               <Route path="/inventory" element={<Inventory />} /> 
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/medicine-db" element={<MedicineDB />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;