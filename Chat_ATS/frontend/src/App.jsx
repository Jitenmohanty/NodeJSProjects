// src/App.jsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./components/Home";
import { ThemeProvider, useTheme } from "./context/ThemeContex";
import ThemeToggle from "./components/ThemeToggle";
import { GroupProvider } from "./context/GroupContext";
import "./App.css";
import { ChatBotProvider } from "./context/BotContext";
import logo from "../src/assets/chat.webp"

// Lazy load components for better performance
const AuthComponent = React.lazy(() => import("./components/AuthComponent"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Public Route Component (accessible only when not authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout Component
const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();

  return (
    <div
      className={` min-h-screen ${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-r from-blue-100 via-white to-blue-100"
      } transition-colors duration-200 overflow-hidden no-scrollbar`}
    >
      {user && (
        <nav
          className={` w-full z-50 shadow-sm transition-colors duration-300 ${
            darkMode
              ? "bg-gray-700 shadow-gray-500/50"
              : "bg-white shadow-gray-200/50"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              {/* Left side - Logo/Brand */}
              <div className="flex items-center">
               <img className="w-16 h-16 scale-100 rounded-full" src={logo}></img>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-4 relative">
                <ThemeToggle />
                <button
                  onClick={logout}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    darkMode
                      ? "bg-red-700 text-white hover:bg-red-600"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-4 lg:px-6">
        {children}
      </main>
    </div>
  );
};

// App Component
const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ChatBotProvider>
            <GroupProvider>
              <Layout>
                <Suspense
                  fallback={
                    <div className="flex h-screen items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  }
                >
                  <Routes>
                    {/* Public Routes */}
                    <Route
                      path="/auth"
                      element={
                        <PublicRoute>
                          <AuthComponent />
                        </PublicRoute>
                      }
                    />

                    {/* Protected Routes */}

                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Home />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </Layout>
            </GroupProvider>
          </ChatBotProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
