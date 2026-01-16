import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pill, Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setStatus({ type: 'error', message: 'Passwords do not match.' });
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            await axios.post(`/api/auth/reset-password/${token}`, { password });
            setStatus({ type: 'success', message: 'Password updated! Redirecting to login...' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.response?.data?.message || "Invalid or expired token." 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans text-slate-900">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            
            <div className="max-w-md w-full mx-4 relative z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl mb-4 animate-in zoom-in duration-700">
                        <Pill size={32} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">MedFlow</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 text-center">Set New Password</p>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
                    {status.message && (
                        <div className={`mb-8 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                            status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                            {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                            {status.message}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all outline-none"
                                        placeholder="••••••••"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all outline-none"
                                        placeholder="••••••••"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || status.type === 'success'}
                            className="w-full py-5 px-4 bg-emerald-500 text-black font-black text-xs uppercase tracking-[0.25em] rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;