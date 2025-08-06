import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiSearch, FiAlertTriangle } from 'react-icons/fi';
import Layout from '../components/Layout';


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
            return <tr><td colSpan="5" className="text-center p-8 text-slate-500">Loading patient records...</td></tr>;
        }
        if (error) {
            return (
                <tr>
                    <td colSpan="5" className="text-center p-8 text-red-600">
                        <div className="flex flex-col items-center justify-center">
                            <FiAlertTriangle className="h-8 w-8 mb-2" />
                            {error}
                        </div>
                    </td>
                </tr>
            );
        }
        if (patients.length === 0) {
            return <tr><td colSpan="5" className="text-center p-8 text-slate-500">No patient records found.</td></tr>;
        }
        return patients.map((patient) => (
            <tr key={patient._id} className="border-b hover:bg-slate-50 transition-colors">
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
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                    <FiUsers className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Patient Details</h2>
                        <p className="text-slate-500">Search and view patient records</p>
                    </div>
                </div>
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search by name or medicine..."
                        className="w-full sm:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 transition"
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
    );
};

export default PatientDetails;