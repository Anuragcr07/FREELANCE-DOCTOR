import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8 text-center">
        <p>&copy; 2025 Med-Manager. All Rights Reserved.</p>
        <p className="mt-2">
          Contact: <a href="tel:+918081482979" className="text-blue-400 hover:underline">+91 8081482979</a> | 
          Email: <a href="mailto:anurag107gopal@gmail.com" className="text-blue-400 hover:underline ml-1">anurag107gopal@gmail.com</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
