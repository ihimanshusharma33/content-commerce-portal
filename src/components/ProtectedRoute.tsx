import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    // Redirect to sign-in page if not authenticated
    return <Navigate to="/signin" state={{ redirectTo: location.pathname }} replace />;
  }
  
  if (requireAdmin && !isAdmin()) {
    // Redirect to unauthorized page if admin access is required but user is not an admin
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;