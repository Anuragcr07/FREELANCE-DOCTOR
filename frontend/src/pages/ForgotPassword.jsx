import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Pill, Mail, Loader2, ArrowRight, ShieldCheck, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // Updated to use your /api proxy
            await axios.post('/api/auth/forgot-password', { email });
            
            setStatus({ 
                type: 'success', 
                message: 'Reset link sent! Please check your email inbox.' 
            });

        } catch (err) {
            setStatus({ 
                type: 'error', 
                message: err.response?.data?.message || "Something went wrong. Please try again." 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden font-sans text-slate-900">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl -z-10" />

            <div className="max-w-md w-full mx-4 relative z-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 mb-4 animate-in zoom-in duration-700">
                        <Pill size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">MedFlow</h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Secure Recovery</p>
                </div>

                {/* Main Card */}
                <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Forgot Password?</h2>
                        <p className="text-slate-400 text-sm mt-1">Enter your email to receive a recovery link.</p>
                    </div>

                    {status.message && (
                        <div className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                            status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                            {status.type === 'success' ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}
                            {status.message}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-emerald-500/5 focus:bg-white transition-all outline-none"
                                        placeholder="doctor@medflow.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || status.type === 'success'}
                            className={`w-full flex items-center justify-center gap-2 py-4 px-4 bg-emerald-600 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 group ${
                                loading || status.type === 'success' ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>Send Recovery Link <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                            <ChevronLeft size={14} /> Back to Sign In
                        </Link>
                    </div>
                </div>

                {/* Footer Badges */}
                <div className="mt-10 flex justify-center gap-8 opacity-30">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <ShieldCheck size={14} /> HIPAA Secure
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Pill size={14} /> MedFlow Identity
                   </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;