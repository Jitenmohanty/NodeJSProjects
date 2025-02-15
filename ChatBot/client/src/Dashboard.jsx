// Updated Dashboard.js
import React from 'react';
import Loader from './components/Loader';
import { useAuth } from './context/AuthContext';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        window.location.href = 'http://localhost:8000/auth/logout';
    };

    if (!user) {
        return <Loader/>
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <img
                        src={user.image}
                        alt={user.displayName}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.displayName}</h2>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-500">Role: {user.role}</p>
                    </div>
                    <div className=''>
                        <MessageCircle className='text-blue-500 h-20 w-14 cursor-pointer' onClick={()=>navigate("/")}/>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;