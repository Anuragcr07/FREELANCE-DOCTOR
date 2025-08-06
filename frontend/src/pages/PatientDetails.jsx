import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiSearch, FiAlertTriangle, FiBarChart2, FiFileText, FiArchive, FiDollarSign, FiHeart } from 'react-icons/fi';
import Layout from '../components/Layout'; // Import the new Layout component
import { Link } from 'react-router-dom';

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
        
        // Use a timeout to prevent an API call on every keystroke
        const searchTimeout = setTimeout(() => {
            fetchPatients();
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [searchTerm]);

    // Renders the content of the table body based on the current state
    const renderTableContent = () => {
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
            <tr key={patient._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4 whitespace-nowrap">{patient.patientName}</td>
                <td className="p-4">{patient.age}</td>
                <td className="p-4">{patient.gender}</td>
                <td className="p-4 max-w-sm truncate" title={patient.symptoms}>{patient.symptoms}</td>
                <td className="p-4">
                    {Array.isArray(patient.recommendedMedicines) && patient.recommendedMedicines.length > 0 ? (
                        <ul className="space-y-1">
                            {patient.recommendedMedicines.map((med, index) => (
                                <li key={index} className="text-sm">{med.medicineName}</li>
                            ))}
                        </ul>
                    ) : (
                        <span className="text-slate-400 text-sm">None</span>
                    )}
                </td>
            </tr>
        ));
    };

    return (
        <Layout>
            {/* Secondary Navigation for consistency */}
            <nav className="mb-6">
                <div className="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2 overflow-x-auto">
                    <Link to="/dashboard" className="flex-shrink-0 flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100"><FiBarChart2 className="mr-2" /> Dashboard</Link>
                    <Link to="/symptom-analysis" className="flex-shrink-0 flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100"><FiFileText className="mr-2" /> Symptom Analysis</Link>
                    <Link to="/inventory" className="flex-shrink-0 flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100"><FiArchive className="mr-2" /> Inventory</Link>
                    <Link to="/revenue" className="flex-shrink-0 flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100"><FiDollarSign className="mr-2" /> Revenue</Link>
                    <Link to="/medicine-db" className="flex-shrink-0 flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100"><FiHeart className="mr-2" /> Medicine DB</Link>
                    <Link to="/patient-details" className="flex-shrink-0 flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md bg-slate-100 font-medium"><FiUsers className="mr-2" /> Patient Details</Link>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="bg-white p-6 lg:p-8 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <FiUsers className="h-8 w-8 text-blue-600 mr-4" />
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Patient Details</h2>
                            <p className="text-slate-500">Search and view all patient records</p>
                        </div>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder="Search by name or symptoms..."
                            className="w-full sm:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-slate-600 uppercase">
                            <tr>
                                <th className="p-4 font-semibold">Patient Name</th>
                                <th className="p-4 font-semibold">Age</th>
                                <th className="p-4 font-semibold">Gender</th>
                                <th className="p-4 font-semibold">Symptoms</th>
                                <th className="p-4 font-semibold">Recommended Medicines</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableContent()}
                        </tbody>
                    </table>
                </div>
            </main>
        </Layout>
    );
};

export default PatientDetails;