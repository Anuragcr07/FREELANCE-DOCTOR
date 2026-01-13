import React, { useState, useEffect } from 'react';
import { ChevronRight, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';
import API from '../services/api';

const CriticalStockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await API.get('/inventory/low-stock');
        // Map backend fields to UI fields
        const formatted = res.data.map(item => ({
          name: item.medicineName,
          current: item.quantity,
          min: item.minStock || 10
        }));
        setAlerts(formatted);
      } catch (err) {
        console.error("Alerts sync failed");
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return (
    <div className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm h-full flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-[36px] border border-slate-100 shadow-sm h-full flex flex-col transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
          <AlertCircle size={20} className={alerts.length > 0 ? "text-orange-500" : "text-slate-200"} />
          Alert Queue
        </h3>
        {alerts.length > 0 && (
          <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase tracking-tighter">
            {alerts.length} Items
          </span>
        )}
      </div>

      <div className="flex-1 space-y-6">
        {alerts.length > 0 ? (
          alerts.map((item, idx) => (
            <div key={idx} className="group">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-slate-700 truncate pr-4">{item.name}</span>
                <span className="text-slate-400 font-black text-[10px] uppercase">{item.current}/{item.min}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((item.current / item.min) * 100, 100)}%` }} 
                />
              </div>
            </div>
          ))
        ) : (
          /* ELITE HEALTHY STATE */
          <div className="h-full flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-700">
             <div className="w-20 h-20 bg-emerald-50 rounded-[32px] flex items-center justify-center mb-6">
                <ShieldCheck className="text-emerald-500" size={40} />
             </div>
             <p className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Inventory Healthy</p>
             <p className="text-xs text-slate-400 mt-2 font-medium max-w-[180px] mx-auto">
               All your medicines are currently above minimum stock levels.
             </p>
          </div>
        )}
      </div>

      {alerts.length > 0 && (
        <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all group">
          Restock Center <ChevronRight size={14} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default CriticalStockAlerts;