import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

const Login = () => {
    const { user } = useAuth();
    const { darkMode } = useTheme();

    if (user) {
        return <Navigate to="/dashboard" />;
    }

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/auth/google';
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
            <div className="flex items-center justify-center min-h-screen">
                <div className={`p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md transition-colors duration-200`}>
                    <h2 className={`mb-6 text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Welcome to AI ChatBot ATS
                    </h2>
                    <button
                        onClick={handleGoogleLogin}
                        className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                    >
                        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.447,1.72-1.459,3.239-2.853,4.384c-2.019,1.654-4.649,2.339-7.146,1.904c-3.868-0.676-7.049-3.857-7.724-7.724c-0.435-2.497,0.25-5.127,1.904-7.146c1.145-1.394,2.664-2.406,4.384-2.853V5.96c0,1.054,0.855,1.909,1.909,1.909c1.054,0,1.909-0.855,1.909-1.909V2.424c0-0.279-0.061-0.544-0.17-0.782c2.082,0.126,4.087,0.92,5.752,2.284c2.049,1.681,3.376,4.015,3.746,6.615l-0.006,0C19.657,11.396,19.163,12,18.5,12h-3.955C13.491,12,12.545,12.946,12.545,12.151z"
                            />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
            <ThemeToggle />
        </div>
    );
};

export default Login;