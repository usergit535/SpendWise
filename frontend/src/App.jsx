import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Page Imports
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/dashboard';
import IncomesPage from './pages/IncomesPage';
import ExpensesPage from './pages/ExpensesPage';

/**
 * ProtectedRoute Component
 * Checks if a token exists in localStorage. 
 * If yes, renders the page. If no, redirects to login.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Private Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/incomes" 
          element={
            <ProtectedRoute>
              <IncomesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/expenses" 
          element={
            <ProtectedRoute>
              <ExpensesPage />
            </ProtectedRoute>
          } 
        />

        {/* Default Redirects */}
        {/* If user hits the base URL, send to dashboard (which will redirect to login if no token) */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Catch-all for 404s */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;