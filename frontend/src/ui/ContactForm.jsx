import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === 'Aman' && password === 'Arti medical 123') {
      console.log('Login successful');
      navigate('/dashboard');
    } else {
      console.log('Login failed');
      setError('Invalid username or password.');
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-lg mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="font-semibold text-gray-700 block mb-2">
                Your Name
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            <div>
              <label htmlFor="password" className="font-semibold text-gray-700 block mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 focus:outline-none"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;