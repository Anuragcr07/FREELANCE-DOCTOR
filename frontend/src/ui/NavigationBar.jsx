import React from 'react';
import { Link } from 'react-router-dom';
import { Pill } from 'lucide-react';

const NavigationBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
              <Pill className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Med<span className="text-emerald-600">Flow</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Features</a>
            <a href='#Footer' className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Contact</a>
            <div className="flex items-center gap-4 ml-4">
              <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors px-4">
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;