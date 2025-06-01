import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { clearAuth } from '../services/authService';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, loading, checkAuth } = useAuth();
  
  // Simple token expiration check without complex timing logic
  useEffect(() => {
    // If we have a user, verify their auth status once
    if (user) {
      checkAuth().catch(() => {
        // If checkAuth fails, the token is likely expired
        clearAuth();
      });
    }
  }, [user, checkAuth]);
  
  // Show loading state or spinner while checking authentication
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }
  
  // If not authenticated, redirect to sign-in page
  if (!user) {
    // Clear any stale auth data before redirecting
    clearAuth();
    
    // When redirecting to signin, pass the current location so we can return after login
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }
  
  // If admin access is required but user is not an admin, redirect to unauthorized page
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;