import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Search, Filter, Plus, Phone, 
  MoreHorizontal, AlertTriangle, Loader2 
} from 'lucide-react';
import Layout from '../components/Layout';

const PatientDetails = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/patients?search=${searchTerm}`);
                setPatients(response.data);
            } catch (err) {
                setError('Failed to load patient data.');
                // Mock data for design preview if server is down
                setPatients([
                    { _id: '1', patientName: 'Sarah Johnson', age: 32, gender: 'Female', phone: '+1 234 567 890', lastVisit: 'Jan 2, 2026', status: 'Active', recommendedMedicines: [{medicineName: 'Paracetamol'}, {medicineName: 'Vitamin D'}] },
                    { _id: '2', patientName: 'Michael Chen', age: 45, gender: 'Male', phone: '+1 234 567 891', lastVisit: 'Jan 1, 2026', status: 'Active', recommendedMedicines: [{medicineName: 'Amoxicillin'}] },
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        const timer = setTimeout(fetchPatients, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <Layout>
            <div className="p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
                        <p className="text-slate-500">Manage and view all patient records</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
                        <Plus size={20} />
                        Add Patient
                    </button>
                </div>

                {/* Filters & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search patients by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                {/* Data Table Area */}
                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-50">
                                <tr className="text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4">Gender</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Last Visit</th>
                                    <th className="px-6 py-4">Recommended Medicines</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center">
                                            <Loader2 className="animate-spin mx-auto text-emerald-500 mb-2" />
                                            <span className="text-slate-400 text-sm">Loading records...</span>
                                        </td>
                                    </tr>
                                ) : patients.map((patient) => (
                                    <tr key={patient._id} className="hover:bg-slate-50/50 transition-colors group">
                                        {/* Patient Identity */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{patient.patientName}</div>
                                                    <div className="text-[11px] text-slate-400 font-medium">{patient.age} years old</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Gender Pill */}
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                patient.gender === 'Female' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'
                                            }`}>
                                                {patient.gender}
                                            </span>
                                        </td>

                                        {/* Phone */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <Phone size={14} className="text-slate-300" />
                                                {patient.phone || '+1 234 567 890'}
                                            </div>
                                        </td>

                                        {/* Last Visit */}
                                        <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                                            {patient.lastVisit || 'Dec 30, 2025'}
                                        </td>

                                        {/* Medicines as Tags */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                {patient.recommendedMedicines?.slice(0, 2).map((med, i) => (
                                                    <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-bold">
                                                        {med.medicineName}
                                                    </span>
                                                ))}
                                                {patient.recommendedMedicines?.length > 2 && (
                                                    <span className="text-[10px] font-bold text-slate-300">
                                                        +{patient.recommendedMedicines.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status Pill */}
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                patient.status === 'Inactive' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-500'
                                            }`}>
                                                {patient.status || 'Active'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PatientDetails;