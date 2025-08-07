import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" className="text-2xl font-bold text-gray-800">
          Med-Manager
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-600 hover:text-blue-600 transition duration-300">
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            className="bg-blue-600 text-black px-5 py-2 rounded-full hover:bg-black-700 transition duration-300 transform hover:scale-105"
          >
            Request a Demo
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-6 pt-2 pb-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-gray-600 hover:text-blue-600">
                {link.label}
              </a>
            ))}
            <a
              href="#demo"
              className="bg-blue-600 text-white text-center px-5 py-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Request a Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;