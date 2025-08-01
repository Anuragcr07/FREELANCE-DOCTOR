import React, { useState, useEffect } from 'react';
import { FiBarChart2, FiFileText, FiArchive, FiDollarSign, FiLink, FiUser, FiSave } from 'react-icons/fi';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SymptomAnalysis = () => {
    const navigate = useNavigate();
    const [symptoms, setSymptoms] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');

    // This function handles saving the patient data.
    const handleSavePatient = async (e) => {
        e.preventDefault();

        if (!patientName || suggestions.length === 0) {
            alert('Please enter a patient name and ensure medicine suggestions are loaded before saving.');
            return;
        }

        const patientData = {
            patientName,
            age,
            gender,
            symptoms,
            recommendedMedicines: suggestions,
        };

        try {
            const response = await axios.post('/api/patients/add', patientData);
            console.log('Patient saved:', response.data);
            navigate('/patient-details'); // Navigate to the details page on success.
        } catch (error) {
            console.error('Error saving patient:', error);
            alert('Failed to save patient details. Please try again.');
        }
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (symptoms.trim() === '') {
                setSuggestions([]);
                return;
            }
            setIsLoading(true);
            try {
                const response = await axios.post('/api/symptoms/analyze', { symptoms });
                setSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]); 
            }
            setIsLoading(false);
        };

        
        const debounceTimeout = setTimeout(() => {
            fetchSuggestions();
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [symptoms]);


    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <Header />

            <nav className="px-4 pt-4">
                <div className="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2">
                    <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/')}>
                        <FiBarChart2 className="mr-2" /> Dashboard
                    </button>
                    <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/symptom-analysis')}>
                        <FiFileText className="mr-2" /> Symptom Analysis
                    </button>
                    <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/inventory')}>
                        <FiArchive className="mr-2" /> Inventory
                    </button>
                    <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/revenue')}>
                        <FiDollarSign className="mr-2" /> Revenue
                    </button>
                    <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/medicine-db')}>
                        <FiLink className="mr-2" /> Medicine DB
                    </button>
                    <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/patient-details')}>
                        <FiLink className="mr-2" /> Patient Details
                    </button>
                </div>
            </nav>

            <main className="p-4">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <div className="flex items-center mb-6">
                        <FiUser className="h-8 w-8 text-blue-600 mr-4" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Patient Information & Symptom Analysis</h2>
                            <p className="text-slate-500">Enter patient details and symptoms to get medicine recommendations from inventory</p>
                        </div>
                    </div>

                  
                    <form onSubmit={handleSavePatient}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label htmlFor="patientName" className="block text-sm font-medium text-slate-700 mb-1">
                                    Patient Name
                                </label>
                                <input
                                    type="text"
                                    id="patientName"
                                    placeholder="Enter patient's full name"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1">
                                    Age
                                </label>
                                <input
                                    type="text"
                                    id="age"
                                    placeholder="Age in years"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1">
                                    Gender
                                </label>
                                <input
                                    type="text"
                                    id="gender"
                                    placeholder="Male/Female/Other"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="symptoms" className="block text-sm font-medium text-slate-700 mb-1">
                                Symptoms & Medical Issues
                            </label>
                            <textarea
                                id="symptoms"
                                rows="6"
                                placeholder="Describe patient's symptoms in detail (e.g., fever, headache, cough, cold, stomach pain, etc.)"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        {isLoading && <p className="text-slate-500 text-center my-4">Searching for recommendations...</p>}

                        {suggestions.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">Suggested Medicines:</h3>
                                <ul className="space-y-2">
                                    {suggestions.map((med) => (
                                        <li key={med._id || med.medicineName} className="p-3 bg-slate-100 rounded-lg flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-slate-700">{med.medicineName}</p>
                                                <p className="text-sm text-slate-500">Category: {med.category}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center px-6 py-4 text-lg font-semibold text-black bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            disabled={!patientName || suggestions.length === 0 || isLoading}
                        >
                            <FiSave className="mr-3" />
                            Save Patient Details
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default SymptomAnalysis;