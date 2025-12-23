import React from 'react';
import { Link } from 'react-router-dom';


const NavigationBar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-xl">+</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Med<span className="text-blue-600">-Manager</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
            
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />
            
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;