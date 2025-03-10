import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

const Dashboard = () => {
    const { user } = useAuth();
    const { darkMode } = useTheme();
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleLogout = () => {
        window.location.href = 'http://localhost:8000/auth/logout';
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8 transition-colors duration-200`}>
            <div className={`max-w-md mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-colors duration-200`}>
                <div className="flex items-center mb-6">
                    {!imageLoaded && <div className="w-16 h-16 rounded-full mr-4 bg-gray-300 animate-pulse"></div>}
                    <img
                        src={user.image}
                        alt={user.displayName}
                        className={`w-16 h-16 rounded-full mr-4 ${imageLoaded ? '' : 'hidden'}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                    <div>
                        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {user.displayName}
                        </h2>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user.email}
                        </p>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Role: {user.role}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>
            <ThemeToggle />
        </div>
    );
};

export default Dashboard;
