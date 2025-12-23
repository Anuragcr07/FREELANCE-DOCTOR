import React from 'react';
import NavigationBar from '../ui/NavigationBar';
import Hero from '../ui/Hero';
import Features from '../ui/Features';
import ContactForm from '../ui/ContactForm';
import Footer from '../ui/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
      <NavigationBar />

      <main>
        <div className="relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
          <Hero />
        </div>

        <div className="py-20 bg-slate-50">
          <Features />
        </div>

        <div className="py-20">
          <ContactForm />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
