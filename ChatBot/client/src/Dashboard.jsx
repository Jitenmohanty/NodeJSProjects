import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/auth/user', {
                    withCredentials: true
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        getUser();
    }, []);

    const handleLogout = () => {
        window.location.href = 'http://localhost:8000/auth/logout';
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                    <img
                        src={user.image}
                        alt={user.displayName}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                        <h2 className="text-2xl font-bold">{user.displayName}</h2>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;