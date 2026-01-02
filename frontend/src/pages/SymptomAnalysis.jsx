import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, Activity, Save, Search, 
  Loader2, CheckCircle2, Pill, ChevronRight,
  UserCircle, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const SymptomAnalysis = () => {
    const navigate = useNavigate();
    const [symptoms, setSymptoms] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [selectedMedicines, setSelectedMedicines] = useState([]);

    const handleMedicineSelection = (medicine) => {
        setSelectedMedicines(prev => {
            const exists = prev.find(m => m._id === medicine._id);
            return exists ? prev.filter(m => m._id !== medicine._id) : [...prev, medicine];
        });
    };

    const handleSavePatient = async (e) => {
        e.preventDefault();
        if (!patientName || selectedMedicines.length === 0) return;
        
        try {
            await axios.post('/api/patients/add', { 
                patientName, age, gender, symptoms, 
                recommendedMedicines: selectedMedicines 
            });
            navigate('/patient-details');
        } catch (error) {
            alert('Failed to save patient details.');
        }
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (symptoms.trim().length < 3) {
                setSuggestions([]);
                return;
            }
            setIsLoading(true);
            try {
                const response = await axios.post('/api/symptoms/analyze', { symptoms });
                setSuggestions(response.data);
            } catch (error) {
                setSuggestions([]);
            }
            setIsLoading(false);
        };
        const timer = setTimeout(fetchSuggestions, 800);
        return () => clearTimeout(timer);
    }, [symptoms]);

    return (
        <Layout>
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                            <Activity size={22} />
                        </div>
                        Symptom Analysis
                    </h1>
                    <p className="text-slate-500 mt-2">Enter symptoms to generate intelligent medicine recommendations from your inventory.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* LEFT PANEL: Patient Form */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                                <UserCircle size={16} /> Patient Information
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="md:col-span-1">
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-all"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Age</label>
                                    <input
                                        type="number"
                                        placeholder="Years"
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-all"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gender</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-all appearance-none"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Describe Symptoms</label>
                                <textarea
                                    rows="6"
                                    placeholder="e.g. Patient has high fever (102°F), dry cough, and mild headache for 2 days..."
                                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-all resize-none leading-relaxed"
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: Suggestions & Save */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[400px] flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Pill size={18} className="text-emerald-500" />
                                    AI Suggestions
                                </h3>
                                {isLoading && <Loader2 className="animate-spin text-emerald-500" size={18} />}
                            </div>

                            <div className="flex-1 space-y-3">
                                {suggestions.length === 0 && !isLoading && (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-40">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <Search size={24} />
                                        </div>
                                        <p className="text-sm font-medium">Type symptoms to see <br/>medicine matches</p>
                                    </div>
                                )}

                                {suggestions.map((med) => (
                                    <div 
                                        key={med._id} 
                                        onClick={() => handleMedicineSelection(med)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
                                            selectedMedicines.some(m => m._id === med._id)
                                            ? 'bg-emerald-50 border-emerald-200'
                                            : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                                selectedMedicines.some(m => m._id === med._id) 
                                                ? 'bg-emerald-500 text-white' 
                                                : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-100'
                                            }`}>
                                                {selectedMedicines.some(m => m._id === med._id) ? <CheckCircle2 size={16}/> : <Pill size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{med.medicineName}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{med.category}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className={`transition-transform ${selectedMedicines.some(m => m._id === med._id) ? 'translate-x-1 text-emerald-500' : 'text-slate-200'}`} />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50">
                                <button
                                    onClick={handleSavePatient}
                                    disabled={!patientName || selectedMedicines.length === 0}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-30 disabled:grayscale disabled:shadow-none active:scale-95"
                                >
                                    <Save size={20} />
                                    Complete Analysis
                                </button>
                                <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1 font-medium uppercase tracking-wider">
                                    <Info size={10} /> Data will be saved to Patient Records
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SymptomAnalysis;