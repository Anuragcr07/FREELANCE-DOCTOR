import { useEffect, useState, useRef } from 'react'; // Added useRef
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('Verifying...');
    const hasCalled = useRef(false); // Ref to track if API was called

    useEffect(() => {
        // Prevent double execution in Strict Mode
        if (hasCalled.current) return;
        hasCalled.current = true;

        const verify = async () => {
            try {
                // 1. Use relative path (utilizes your Vite proxy)
                // 2. Await the response to catch specific errors
                const response = await axios.get(`/api/auth/verify/${token}`);
                setStatus('Email Verified Successfully!');
            } catch (err) {
                console.error("Verification Error:", err.response?.data);
                // Display the actual error message from backend if available
                const message = err.response?.data?.message || 'Verification failed. The link may have expired.';
                setStatus(message);
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="p-8 bg-white shadow-md rounded-lg text-center">
                <h1 className={`text-2xl font-bold mb-4 ${status.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {status}
                </h1>
                <Link to="/login" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                    Go to Login
                </Link>
            </div>
        </div>
    );
};

export default VerifyEmail;