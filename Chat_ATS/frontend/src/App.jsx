// src/App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './components/Home';


// Lazy load components for better performance
const AuthComponent = React.lazy(() => import('./components/AuthComponent'));
// const ChatInterface = React.lazy(() => import('./components/ChatInterface'));
const UserProfile = React.lazy(() => import('./components/UserProfile'));
const Settings = React.lazy(() => import('./components/Settings'));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <nav className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Chat App</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => window.location.href = '/profile'}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Profile
                </button>
                <button
                  onClick={() => window.location.href = '/settings'}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Settings
                </button>
                <button
                  onClick={logout}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

// App Component
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
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
                path="/profile"
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
          

              {/* Catch all route */}
              <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;