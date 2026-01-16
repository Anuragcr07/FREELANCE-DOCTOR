import React, { useState, useEffect } from 'react';
import { 
  Activity, Save, Search, Loader2, CheckCircle2, 
  Pill, ChevronRight, UserCircle, Info, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../services/api'; // Ensure this uses your protected axios instance

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
        if (!patientName || selectedMedicines.length === 0) {
            alert("Please provide patient name and select at least one medicine.");
            return;
        }
        
        try {
            // Protected POST call (userId is handled by backend token extraction)
            await API.post('/patients/add', { 
                patientName, age, gender, symptoms, 
                recommendedMedicines: selectedMedicines 
            });
            alert("Analysis successfully saved to Patient Records");
            navigate('/patient-details');
        } catch (error) {
            alert('Session expired. Please log in again.');
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
                // Uses protected API instance
                const response = await API.post('/symptoms/analyze', { symptoms });
                setSuggestions(response.data);
            } catch (error) {
                setSuggestions([]);
            }
            setIsLoading(false);
        };
        const debounce = setTimeout(fetchSuggestions, 800);
        return () => clearTimeout(debounce);
    }, [symptoms]);

    return (
        <Layout>
            <div className="p-8 max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                                <Activity size={26} />
                            </div>
                            Symptom Analysis
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">AI-assisted diagnosis and inventory matching.</p>
                    </div>
                    <button 
                        onClick={() => {setSymptoms(''); setPatientName(''); setSelectedMedicines([])}}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest rounded-xl hover:text-red-500 transition-all"
                    >
                        <Trash2 size={16} /> Reset Analysis
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* LEFT PANEL: INPUT FORM */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-10 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">
                                <UserCircle size={14} /> Intake Information
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <div className="md:col-span-1 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Identity</label>
                                    <input type="text" placeholder="Full Name" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold transition-all" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Age</label>
                                    <input type="number" placeholder="Years" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold transition-all" value={age} onChange={(e) => setAge(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sex</label>
                                    <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold appearance-none transition-all" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Symptom Log</label>
                                <textarea rows="7" placeholder="Detail symptoms like fever, nausea, or duration..." className="w-full px-6 py-5 bg-slate-50 border-none rounded-[32px] focus:ring-4 focus:ring-emerald-500/5 text-sm font-bold transition-all resize-none leading-relaxed" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL: AI RESULTS */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl min-h-[500px] flex flex-col relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="font-black text-slate-800 text-lg flex items-center gap-3">
                                    <Pill size={22} className="text-emerald-500" />
                                    Inventory Match
                                </h3>
                                {isLoading && <Loader2 className="animate-spin text-emerald-500" size={20} />}
                            </div>

                            <div className="flex-1 space-y-4 custom-scrollbar overflow-y-auto pr-1">
                                {suggestions.length === 0 && !isLoading && (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                        <Search size={48} className="mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Awaiting Log Data</p>
                                    </div>
                                )}

                                {suggestions.map((med) => (
                                    <div 
                                        key={med._id} 
                                        onClick={() => handleMedicineSelection(med)} 
                                        className={`p-5 rounded-3xl border transition-all cursor-pointer group flex items-center justify-between ${
                                            selectedMedicines.some(m => m._id === med._id) 
                                            ? 'bg-emerald-50 border-emerald-200' 
                                            : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-slate-50 shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                                selectedMedicines.some(m => m._id === med._id) ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'
                                            }`}>
                                                {selectedMedicines.some(m => m._id === med._id) ? <CheckCircle2 size={18}/> : <Pill size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 tracking-tight">{med.medicineName}</p>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{med.category}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className={selectedMedicines.some(m => m._id === med._id) ? 'text-emerald-500' : 'text-slate-200'} />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-10 border-t border-slate-50">
                                <button 
                                    onClick={handleSavePatient} 
                                    disabled={!patientName || selectedMedicines.length === 0} 
                                    className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-emerald-600 text-black font-black text-xs uppercase tracking-[0.25em] rounded-[24px] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all disabled:opacity-20 active:scale-95"
                                >
                                    <Save size={20} /> Commit Analysis
                                </button>
                                <div className="flex justify-center items-center gap-2 mt-6 opacity-30">
                                    <Info size={12} />
                                    <p className="text-[9px] font-black uppercase tracking-widest">User Isolated Processing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SymptomAnalysis;