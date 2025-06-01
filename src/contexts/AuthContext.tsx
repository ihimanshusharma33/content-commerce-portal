import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserInfo, login as loginService, logout as logoutService, clearAuth } from '../services/authService';

// Define the user type
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'student';
}

// Define the authentication context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Create the authentication context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Function to check authentication status
  const checkAuth = async (): Promise<void> => {
    // If we've already checked auth and have a user, no need to check again
    if (authChecked && user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const userData = await getUserInfo();
      setUser(userData);
      setError(null);
      
      // Update localStorage with auth state
      localStorage.setItem('is_authenticated', 'true');
      localStorage.setItem('user_role', userData.role);
    } catch (err) {
      setUser(null);
      // Clear localStorage auth state
      localStorage.setItem('is_authenticated', 'false');
      localStorage.removeItem('user_role');
      // Don't set error here as this is a routine check
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await loginService(email, password);
      await checkAuth(); // After successful login, fetch user data
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await logoutService();
      setUser(null);
      clearAuth(); // Clear localStorage auth state
    } catch (err: any) {
      setError(err.message || 'Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);