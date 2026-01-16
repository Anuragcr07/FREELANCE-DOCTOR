import React, { useState, useEffect } from 'react';
import { 
  User, Search, Filter, Plus, Phone, 
  MoreHorizontal, Loader2, Calendar, 
  ChevronRight, Trash2, Pill, ShieldCheck
} from 'lucide-react';
import Layout from '../components/Layout';
import API from '../services/api'; // Use your protected axios instance

const PatientDetails = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Using the protected API service (handles JWT/userId)
                const response = await API.get(`/patients?search=${searchTerm}`);
                setPatients(response.data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Session timed out. Please refresh or re-login.');
                // Fallback for design check
                setPatients([]);
            } finally {
                setIsLoading(false);
            }
        };
        
        const timer = setTimeout(fetchPatients, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <Layout>
            <div className="p-8 max-w-7xl mx-auto space-y-10">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                <User size={26} />
                            </div>
                            Patient Directory
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Securely access and manage your clinic's patient history.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-Black font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95">
                        <Plus size={18} />
                        Register New Patient
                    </button>
                </div>

                {/* Intelligent Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search directory by name, ID, or medication..."
                            className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[24px] shadow-sm focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-semibold placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                             <span className="text-[10px] font-black text-slate-400">⌘K</span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                        <Filter size={16} />
                        Advanced Filters
                    </button>
                </div>

                {/* Data Table Container */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-50 bg-slate-50/30">
                                <tr className="text-slate-400 text-[10px] uppercase tracking-[0.25em] font-black">
                                    <th className="px-10 py-7">Patient Profile</th>
                                    <th className="px-10 py-7">Identity</th>
                                    <th className="px-10 py-7">Contact Info</th>
                                    <th className="px-10 py-7">Medical Recommendation</th>
                                    <th className="px-10 py-7 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="py-32 text-center">
                                            <Loader2 className="animate-spin mx-auto text-emerald-500 mb-4" size={40} />
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Decrypting Secure Records</p>
                                        </td>
                                    </tr>
                                ) : patients.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-32 text-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                                <User size={32} />
                                            </div>
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No matching records found in your database</p>
                                        </td>
                                    </tr>
                                ) : patients.map((patient) => (
                                    <tr key={patient._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                        {/* Profile Column */}
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm border border-emerald-100/50">
                                                    {patient.patientName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 text-sm">{patient.patientName}</div>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <ShieldCheck size={10} className="text-emerald-500" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Verified Profile</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Identity Column */}
                                        <td className="px-10 py-6">
                                            <div className="space-y-1">
                                                <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                                                    patient.gender === 'Female' ? 'bg-pink-50 text-pink-500 border border-pink-100' : 'bg-blue-50 text-blue-500 border border-blue-100'
                                                }`}>
                                                    {patient.gender}
                                                </span>
                                                <p className="text-[11px] font-bold text-slate-500 mt-1">{patient.age} Years Old</p>
                                            </div>
                                        </td>

                                        {/* Contact Column */}
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                                                    <Phone size={12} className="text-slate-300" />
                                                    {patient.phone || '+91 00000 00000'}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                                                    <Calendar size={12} className="text-slate-200" />
                                                    Last Visit: {new Date(patient.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Recommended Meds Column */}
                                        <td className="px-10 py-6">
                                            <div className="flex flex-wrap gap-1.5">
                                                {patient.recommendedMedicines?.slice(0, 2).map((med, i) => (
                                                    <div key={i} className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl text-[9px] font-black uppercase flex items-center gap-1">
                                                        <Pill size={8} /> {med.medicineName || med}
                                                    </div>
                                                ))}
                                                {patient.recommendedMedicines?.length > 2 && (
                                                    <span className="text-[10px] font-black text-slate-300 self-center">
                                                        +{patient.recommendedMedicines.length - 2} More
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions Column */}
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-slate-200 hover:text-emerald-500 transition-colors">
                                                    <ChevronRight size={22} />
                                                </button>
                                                <button className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Privacy Badge */}
                <div className="flex justify-center items-center gap-3 opacity-20">
                    <div className="h-px w-20 bg-slate-300" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Patient Privacy Protected</p>
                    <div className="h-px w-20 bg-slate-300" />
                </div>
            </div>
        </Layout>
    );
};

export default PatientDetails;