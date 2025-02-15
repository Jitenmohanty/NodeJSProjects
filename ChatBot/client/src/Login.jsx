/// src/components/Login.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {  Key } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/auth/google';
    };

    if (user) {
        navigate('/dashboard');
        return null;
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            <div className="p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Welcome to AI ChatBot ATS</h2>
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                >
                   <Key className='mr-4'/>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
