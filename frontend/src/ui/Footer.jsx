import React from 'react';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 border-b border-slate-800 pb-12 mb-12">
          <div>
            <div className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
               <div className="w-8 h-8 bg-emerald-600 rounded-lg" /> MedFlow
            </div>
            <p className="max-w-xs leading-relaxed">
              Empowering pharmacies with modern tools for better patient care and efficient operations.
            </p>
          </div>
          <div className="flex flex-col md:items-end gap-4">
             <div className="flex items-center gap-3 hover:text-white transition-colors">
               <Phone className="w-4 h-4 text-emerald-500" /> +91 8081482979
             </div>
             <div className="flex items-center gap-3 hover:text-white transition-colors">
               <Mail className="w-4 h-4 text-emerald-500" /> anurag107gopal@gmail.com
             </div>
          </div>
        </div>
        <div className="text-sm text-center">
          &copy; 2026 MedFlow Systems. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;