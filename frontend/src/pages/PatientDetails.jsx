// src/pages/PatientDetails.js
import React, { useState, useEffect } from 'react';

import {
    FiUsers,
    FiSearch,
    FiAlertTriangle,
    FiBarChart2,
    FiFileText,
    FiArchive,
    FiDollarSign,
    FiLink
} from 'react-icons/fi';

import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PatientDetails = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`/api/patients?search=${searchTerm}`);
                setPatients(response.data);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('Failed to load patient data. Please ensure the server is running and try again.');
                setPatients([]);
            }
            setIsLoading(false);
        };
        const searchTimeout = setTimeout(() => {
            fetchPatients();
        }, 300);
        return () => clearTimeout(searchTimeout);
    }, [searchTerm]);

    const renderContent = () => {
        if (isLoading) {
            return <tr><td colSpan="5" className="text-center p-4 text-slate-500">Loading patient records...</td></tr>;
        }
        if (error) {
            return (
                <tr>
                    <td colSpan="5" className="text-center p-4 text-red-600">
                        <div className="flex flex-col items-center justify-center">
                            <FiAlertTriangle className="h-8 w-8 mb-2" />
                            {error}
                        </div>
                    </td>
                </tr>
            );
        }
        if (patients.length === 0) {
            return <tr><td colSpan="5" className="text-center p-4 text-slate-500">No patient records found.</td></tr>;
        }
        return patients.map((patient) => (
            <tr key={patient._id} className="border-b hover:bg-slate-50">
                <td className="p-3">{patient.patientName}</td>
                <td className="p-3">{patient.age}</td>
                <td className="p-3">{patient.gender}</td>
                <td className="p-3 max-w-sm truncate">{patient.symptoms}</td>
                <td className="p-3">
                    {Array.isArray(patient.recommendedMedicines) && (
                        <ul className="list-disc list-inside">
                            {patient.recommendedMedicines.map((med, index) => (
                                <li key={index}>{med.medicineName}</li>
                            ))}
                        </ul>
                    )}
                </td>
            </tr>
        ));
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <Header />

            <nav className="px-4 pt-4">
                <div className="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2">
                    <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/dashboard')}>
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
                    <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100" onClick={() => navigate('/billing')}>
                        <FiDollarSign className="mr-2" /> Billing
                    </button>
                </div>
            </nav>

            <main className="p-4">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <FiUsers className="h-8 w-8 text-blue-600 mr-4" />
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">Patient Details</h2>
                                <p className="text-slate-500">Search and view patient records</p>
                            </div>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name or medicine..."
                                className="w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="p-3 font-semibold text-slate-600">Patient Name</th>
                                    <th className="p-3 font-semibold text-slate-600">Age</th>
                                    <th className="p-3 font-semibold text-slate-600">Gender</th>
                                    <th className="p-3 font-semibold text-slate-600">Symptoms</th>
                                    <th className="p-3 font-semibold text-slate-600">Recommended Medicines</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderContent()}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDetails;