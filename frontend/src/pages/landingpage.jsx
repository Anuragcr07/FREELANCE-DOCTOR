import React from 'react';
import NavigationBar from '../ui/NavigationBar';
import Hero from '../ui/Hero';
import Features from '../ui/Features';
import ContactForm from '../ui/ContactForm';
import Footer from '../ui/Footer';

const LandingPage = () => {
  return (
    <div className="bg-white">
      <NavigationBar />
      <main>
        <Hero />
        <Features />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;