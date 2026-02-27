import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center">
            <span className="text-white">Loading...</span>
        </div>;
    }

    if (!user) {
        // Redirect to login but save the attempted url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        // User does not have right role
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
