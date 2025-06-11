import apiClient from "../utils/apiClient";

// Interface for the user data
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'student';
}

// Interface for login response
interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    token: string;
    user_id: number;
    role: string;
  };
}

/**
 * Attempts to log in with the provided credentials
 * The JWT token will be stored both in localStorage and sent with requests via Authorization header
 */
export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await apiClient.post<LoginResponse>('/login', { email, password });
    
    if (!response.data || !response.data.status) {
      throw new Error(response.data?.message || 'Login failed');
    }
    
    // Store token and user information in localStorage
    if (response.data.data && response.data.data.token) {
      const { token, user_id, role } = response.data.data;
      
      // Store authentication data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('is_authenticated', 'true');
      localStorage.setItem('auth_timestamp', Date.now().toString());
      
      // Store user role - map 'user' role to 'student' if needed
      const normalizedRole = role === 'admin' ? 'admin' : 'student';
      localStorage.setItem('user_role', normalizedRole);
      
      // Store user ID
      localStorage.setItem('user_id', user_id.toString());
      
      // Set the token in the Authorization header for future requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Return a user object with the available information
      return {
        id: user_id,
        email: email, // Store the email they logged in with
        name: '', // We may not have this info yet, can be updated later
        role: normalizedRole
      };
    } else {
      throw new Error('No authentication token received');
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

/**
 * Gets the current authenticated user information
 * Returns null if not authenticated or if unable to get user info
 */
export const getUserInfo = async (): Promise<User | null> => {
  try {
    // First, verify we have a valid auth state
    if (!isAuthenticated()) {
      return null;
    }
    
    // Check if we have a token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      clearAuth();
      return null;
    }
    
    // Ensure the token is in the Authorization header
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Attempt to get user info from API
    try {
      const response = await apiClient.get('/me');
      
      if (response.data && response.status === 200) {
        // Extract user data from response, handling different response structures
        const userData = response.data.data || response.data;
        
        if (userData) {
          const user: User = {
            id: userData.id || parseInt(localStorage.getItem('user_id') || '0'),
            email: userData.email || '',
            name: userData.name || '',
            role: userData.role === 'admin' ? 'admin' : 'student'
          };
          
          // Update localStorage with any new info
          if (userData.role) {
            localStorage.setItem('user_role', userData.role === 'admin' ? 'admin' : 'student');
          }
          
          return user;
        }
      }
    } catch (apiError) {
      console.warn('Could not fetch user profile from API:', apiError);
      // Continue with fallback - don't return null here
    }
    
    // Fallback: construct user from localStorage if API call fails
    const userId = localStorage.getItem('user_id');
    const userRole = localStorage.getItem('user_role');
    
    if (userId && userRole) {
      return {
        id: parseInt(userId),
        email: '',
        name: '',
        role: userRole === 'admin' ? 'admin' : 'student'
      };
    }
    
    // If we can't create a user object, clear auth and return null
    clearAuth();
    return null;
  } catch (error) {
    console.error('Error in getUserInfo:', error);
    return null;
  }
};

/**
 * Logs out the current user by clearing the JWT token
 */
export const logout = async (): Promise<void> => {
  try {
    // Get the token to include in the logout request
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Make sure the token is in the Authorization header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Try to logout on the server
      try {
        await apiClient.post('/logout');
      } catch (logoutError) {
        console.warn('Server logout failed, continuing with local logout:', logoutError);
      }
    }
  } finally {
    // Always clear the local auth state
    clearAuth();
  }
};

/**
 * Checks if user is authenticated by verifying localStorage state
 */
export const isAuthenticated = (): boolean => {
  try {
    const isAuth = localStorage.getItem('is_authenticated') === 'true';
    const hasToken = !!localStorage.getItem('auth_token');
    
    // Both conditions must be true
    return isAuth && hasToken;
  } catch (e) {
    return false;
  }
};

/**
 * Checks if user is an admin
 */
export const isAdmin = (): boolean => {
  try {
    return isAuthenticated() && localStorage.getItem('user_role') === 'admin';
  } catch (e) {
    return false;
  }
};

/**
 * Clears all authentication state
 */
export const clearAuth = (): void => {
  // Clear localStorage auth-related items
  localStorage.removeItem('is_authenticated');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_id');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_timestamp');
  
  // Remove Authorization header
  delete apiClient.defaults.headers.common['Authorization'];
};

/**
 * Sets up authentication from stored credentials on app initialization
 * Call this when your app starts
 */
export const initializeAuth = (): void => {
  // Check if we have authentication data
  const token = localStorage.getItem('auth_token');
  const isAuth = localStorage.getItem('is_authenticated') === 'true';
  
  if (token && isAuth) {
    // Set the authorization header for future API calls
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Clear any partial auth state
    clearAuth();
  }
};