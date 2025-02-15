// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await api.get('/auth/user');
                console.log('User response:', response.data); // Debug log
                setUser(response.data);
            } catch (error) {
                console.error('Error checking user:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);