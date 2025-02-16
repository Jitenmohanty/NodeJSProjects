// Updated App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from "./Dashboard";
import ChatInterface from "./components/ChatInterface";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Login from "./Login"
import ThemeToggle from "./components/ThemeToggle";

const Home = () => {
    const [showChat, setShowChat] = useState(false);
    const { user } = useAuth();
    const { darkMode } = useTheme();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-100 via-white to-blue-100'} transition-colors duration-200`}>
            <div className="flex items-center justify-center min-h-screen">
                {!showChat ? (
                    <div className="text-center p-10 max-w-2xl">
                        <h1 className={`text-4xl font-bold mb-4 animate-fadeIn ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            🤖 Welcome to <span className="text-blue-500">AI ChatBot ATS</span>
                        </h1>
                        <p className={`text-lg mb-6 animate-fadeIn delay-200 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Your personal AI assistant at your service. Start chatting now!
                        </p>
                        <button
                            onClick={() => setShowChat(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 animate-fadeIn delay-400"
                        >
                            🚀 Get Started
                        </button>
                    </div>
                ) : (
                    <ChatInterface />
                )}
            </div>
            <ThemeToggle />
        </div>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;