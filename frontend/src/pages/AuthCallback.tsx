import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthCallback: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userString = params.get('user');

        if (token && userString) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', userString);
            
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);

        } else {
            console.error("Authentication failed. Redirecting to login.");
            navigate('/');
        }
    }, [location, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <div className="loader"></div>
            <p className="mt-4 text-lg text-gray-600">Authenticating with Google...</p>
        </div>
    );
};

export default AuthCallback;