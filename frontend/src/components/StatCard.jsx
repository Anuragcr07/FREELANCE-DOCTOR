import React from 'react';

const StatCard = ({ title, value, trend, icon, color, subtitle }) => {
  const isRed = trend.startsWith('-');
  
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color === 'orange' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-600'}`}>
          {icon}
        </div>
        <div className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${isRed ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
          {isRed ? '↘' : '↗'} {trend}
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-slate-400 text-xs font-medium mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{subtitle || 'vs last month'}</p>
      </div>

      {/* Subtle background SVG sparkline */}
      <div className="absolute bottom-0 left-0 right-0 h-12 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 20" className="w-full h-full">
           <path d="M0 20 L0 10 Q 25 15, 50 5 T 100 10 L 100 20 Z" fill={color === 'orange' ? '#f97316' : '#10b981'} />
        </svg>
      </div>
    </div>
  );
};

export default StatCard;