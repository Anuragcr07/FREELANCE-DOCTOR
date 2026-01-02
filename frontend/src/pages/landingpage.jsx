import React from 'react';
import NavigationBar from '../ui/NavigationBar';
import Hero from '../ui/Hero';
import Features from '../ui/Features';
import Testimonials from '../ui/Testimonials';
import Footer from '../ui/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
      <NavigationBar />
      <main>
        {/* Hero Section with Grid Background */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <Hero />
        </div>

        {/* Features Section */}
        <div className="py-24 bg-white">
          <Features />
        </div>

        {/* Testimonials Section with Grid Pattern */}
        <div className="py-24 bg-slate-50/50 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
          <Testimonials />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;