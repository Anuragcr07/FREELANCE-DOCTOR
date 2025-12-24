import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // Replace with your actual backend URL (e.g., https://your-app.onrender.com)
            const res = await axios.post('https://freelance-doctor-2.onrender.com/api/auth/login', formData);
            
            // 1. Save the token and user info to LocalStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.result));

            setStatus({ type: 'success', message: 'Login successful! Redirecting...' });

            // 2. Redirect to your dashboard or home page after 1.5 seconds
            setTimeout(() => {
                navigate('/dashboard'); // Change this to your main app route
            }, 1500);

        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.response?.data?.message || "Invalid email or password." 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            Create one for free
                        </Link>
                    </p>
                </div>

                {status.message && (
                    <div className={`p-4 rounded-lg text-sm flex items-center ${
                        status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                        {status.message}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                                placeholder="doctor@hospital.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input id="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">Remember me</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-200 transition-all ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;