import React from 'react';
import { LayoutDashboard, Users, Box, BarChart3, ShieldCheck, Zap } from 'lucide-react';

const featuresData = [
  {
    icon: <LayoutDashboard className="w-6 h-6 text-emerald-600" />,
    title: 'Smart Dashboard',
    description: 'Real-time insights with beautiful Bento Grid layouts and sparkline charts.',
  },
  {
    icon: <Users className="w-6 h-6 text-emerald-600" />,
    title: 'Patient Management',
    description: 'Complete patient records with prescription history and visit tracking.',
  },
  {
    icon: <Box className="w-6 h-6 text-emerald-600" />,
    title: 'Inventory Control',
    description: 'Automated stock alerts and expiry tracking to prevent shortages.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
    title: 'Analytics & Reports',
    description: 'Comprehensive analytics for revenue, sales, and inventory trends.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
    title: 'Secure & Compliant',
    description: 'HIPAA-compliant data storage with end-to-end encryption.',
  },
  {
    icon: <Zap className="w-6 h-6 text-emerald-600" />,
    title: 'Lightning Fast',
    description: 'Optimized performance for quick access during busy pharmacy hours.',
  },
];

const Features = () => {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Features</span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Everything you need to run <br/> your pharmacy</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">From inventory management to patient records, MedFlow provides all the tools you need in one beautiful interface.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuresData.map((feature, index) => (
          <div key={index} className="group p-10 rounded-3xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-50 transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
            <p className="text-slate-500 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;