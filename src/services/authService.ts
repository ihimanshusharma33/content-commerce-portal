import apiClient from "../utils/apiClient";


// Token key for localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Interface for the login response
interface LoginResponse {
    token: string;
    user: {
        id: number;
        email: string;
        role: 'admin' | 'student';
        name: string;
    };
}

// Login function
export const login = async (email: string, password: string): Promise<any> => {
    try {
        const response = await apiClient.post('/login', { email, password });
        
        if (response.data.status && response.data.data.token) {
            const token = response.data.data.token;
            
            // Store the token
            setToken(token);
            
            // Extract user info from token
            const decodedToken = decodeToken(token);
            
            // Store user data
            if (decodedToken) {
                setUserData(decodedToken);
            }
            
            // Set up auth header
            setupAuthHeader(token);
            
            return response.data;
        }
        
        throw new Error(response.data.message || 'Login failed');
    } catch (error) {
        clearAuth();
        throw error;
    }
};

// Logout function
export const logout = (): void => {
    clearAuth();
    window.location.href = '/signin'; // Redirect to sign-in page
};

// Set auth token in localStorage
export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

// Get auth token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

// Set user data in localStorage
export const setUserData = (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get user data from localStorage
export const getUserData = (): any => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
};

// Clear auth data (both token and user data)
export const clearAuth = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
};

// Setup auth header for all requests
export const setupAuthHeader = (token: string): void => {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Initialize auth header from localStorage on app startup
export const initializeAuth = (): void => {
    const token = getToken();
    if (token) {
        setupAuthHeader(token);
    }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// Check if user is admin
export const isAdmin = (): boolean => {
    const user = getUserData();
    return user?.role === 'admin';
};

// Add this function to decode JWT token and extract user information
export const decodeToken = (token: string): any => {
  try {
    // JWT tokens are in format: header.payload.signature
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64').toString('ascii');
    return JSON.parse(payload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Function to get user name from stored data
export const getUserName = (): string => {
  const userData = getUserData();
  return userData?.name || 'User';
};