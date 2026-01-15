import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Sparkles, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-20 pb-32 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-left">
  
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-8">
            Efficient Medical Store <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Management.</span>
          </h1>

          <p className="text-xl text-slate-600 max-w-xl mb-12 leading-relaxed">
            Streamline your pharmacy operations with intelligent inventory tracking, patient management, and real-time analytics — all in one beautiful interface.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
        

          
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="relative hidden lg:block">
           <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="flex items-center justify-between mb-8">
                <div className="text-xs text-slate-400 font-mono">medflow.app/dashboard</div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                 <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="text-[10px] text-emerald-600 font-bold mb-1">+12%</div>
                    <div className="text-xl font-bold text-slate-800">156</div>
                    <div className="text-[10px] text-slate-500">Patients Today</div>
                 </div>
                 <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100">
                    <div className="text-[10px] text-teal-600 font-bold mb-1">+8%</div>
                    <div className="text-xl font-bold text-slate-800">$4,589</div>
                    <div className="text-[10px] text-slate-500">Revenue</div>
                 </div>
                 <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="text-[10px] text-orange-600 font-bold mb-1">-5%</div>
                    <div className="text-xl font-bold text-slate-800">23</div>
                    <div className="text-[10px] text-slate-500">Pending</div>
                 </div>
              </div>

              <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-end gap-2 p-4">
                 {[40, 70, 45, 90, 65, 85, 55].map((h, i) => (
                   <div key={i} style={{height: `${h}%`}} className="flex-1 bg-emerald-200 rounded-t-sm" />
                 ))}
              </div>
           </div>
           {/* Floating Badge */}
           <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 animate-bounce">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-sm font-bold">Order Complete!</div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;