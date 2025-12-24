// src/pages/VerifyEmail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        const verify = async () => {
            try {
                await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
                setStatus('Email Verified Successfully!');
            } catch (err) {
                setStatus('Verification failed. The link may have expired.');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <h1 className="text-2xl font-bold mb-4">{status}</h1>
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Go to Login</Link>
        </div>
    );
};
export default VerifyEmail;