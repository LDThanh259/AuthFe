import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
    const location = useLocation();
    const { user, isAuthenticated, loading } = useAuth();

    console.log('[ProtectedRoute] Rendering:', { 
        path: location.pathname, 
        loading, 
        isAuthenticated, 
        user: user ? { ...user, roles: user.roles } : null,
        requiredRoles: roles 
    });


    if (loading) {
        console.log('[ProtectedRoute] Loading authentication state...');
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        console.warn('[ProtectedRoute] User not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && (!user.roles || !roles.some(role => user?.roles?.includes(role)))) {
        console.error('[ProtectedRoute] Access denied:', { 
            requiredRoles: roles, 
            userRoles: user.roles 
        });
        return <Navigate to="/unauthorized" replace />;
    }
    console.log('[ProtectedRoute] Access granted');

    return children;
}