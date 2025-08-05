import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 bg-white text-center">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Efficient Medical Store Management
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Streamline your pharmacy operations with our all-in-one management system.
        </p>
        <div className="mt-8">
          <a
            href="#contact"
            className="bg-blue-600 text-white font-bold px-8 py-4 rounded-full text-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 inline-block"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;