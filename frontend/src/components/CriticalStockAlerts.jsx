import React from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';

const CriticalStockAlerts = () => {
  const alerts = [
    { name: 'Paracetamol 500mg', current: 12, min: 50 },
    { name: 'Amoxicillin 250mg', current: 8, min: 30 },
    { name: 'Ibuprofen 400mg', current: 5, min: 25 },
    { name: 'Vitamin C 1000mg', current: 15, min: 40 },
  ];

  return (
    <div className="bg-[#FEF2F2] p-6 rounded-3xl border border-red-50 h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
            <AlertCircle size={18} />
          </div>
          <h3 className="font-bold text-slate-800">Low Stock Alert</h3>
        </div>
        <span className="text-[10px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">5 items</span>
      </div>

      <div className="space-y-6">
        {alerts.map((item, idx) => (
          <div key={idx} className="group cursor-pointer">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-700">{item.name}</span>
              <span className="text-slate-400 font-medium">{item.current}/{item.min}</span>
            </div>
            <div className="h-1.5 w-full bg-red-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full transition-all duration-500" 
                style={{ width: `${(item.current / item.min) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-8 flex items-center justify-center gap-2 text-emerald-600 text-sm font-bold group">
        View all 5 items 
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default CriticalStockAlerts;