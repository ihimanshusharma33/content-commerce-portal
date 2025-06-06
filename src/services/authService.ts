import apiClient from "../utils/apiClient";

// Interface for the user data
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'student';
}

/**
 * Attempts to log in with the provided credentials
 * The JWT token will be stored both in localStorage and sent with requests via Authorization header
 */
export const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await apiClient.post('/login', { email, password });
    
    if (!response.data || !response.data.status) {
      throw new Error(response.data?.message || 'Login failed');
    }
    
    // Store token in localStorage
    if (response.data.data && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('is_authenticated', 'true');
      
      // Store user role - map 'user' role to 'student' if needed
      const role = response.data.data.role === 'admin' ? 'admin' : 'student';
      localStorage.setItem('user_role', role);
      
      // Store user ID if available
      if (response.data.data.user_id) {
        localStorage.setItem('user_id', response.data.data.user_id.toString());
      }
      
      // Set the token in the Authorization header for future requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
    } else {
      throw new Error('No authentication token received');
    }
    
    return;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    throw new Error(errorMessage);
  }
};

/**
 * Gets the current authenticated user information
 */
export const getUserInfo = async (): Promise<User> => {
  try {
    // Check if we have a token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Ensure the token is in the Authorization header
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Attempt to get user info
    const response = await apiClient.get('/me');
    // console.log(response);
    // If we already have some user info in localStorage, we can construct a user object
    // even if the API call fails or is still in progress
    if (!response.data || response.status !== 200) {
      // Try to build a minimal user object from localStorage
      const userId = localStorage.getItem('user_id');
      const userRole = localStorage.getItem('user_role');
      
      if (userId && userRole) {
        // Return a basic user object based on localStorage data
        return {
          id: parseInt(userId),
          email: '',  // We don't have this info in localStorage
          name: '',   // We don't have this info in localStorage
          role: userRole === 'admin' ? 'admin' : 'student'
        };
      }
      
      throw new Error('Failed to get user information');
    }
    
    // If the API response includes the user info directly
    if (response.data.data && response.data.data.id) {
      return {
        id: response.data.data.id,
        email: response.data.data.email || '',
        name: response.data.data.name || '',
        role: response.data.data.role === 'admin' ? 'admin' : 'student'
      };
    }
    
    // If the API response is the user info itself
    return {
      id: response.data.id,
      email: response.data.email || '',
      name: response.data.name || '',
      role: response.data.role === 'admin' ? 'admin' : 'student'
    };
  } catch (error) {
    console.log(error);
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
      await apiClient.post('/logout');
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear the local auth state
    clearAuth();
    // Remove Authorization header
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Checks if user is authenticated
 * We'll use the context state for this, but this is kept for compatibility
 */
export const isAuthenticated = (): boolean => {
  try {
    // Use localStorage instead of sessionStorage for persistence across sessions
    return localStorage.getItem('is_authenticated') === 'true';
  } catch (e) {
    return false;
  }
};

/**
 * Checks if user is an admin
 * We'll use the context state for this, but this is kept for compatibility
 */
export const isAdmin = (): boolean => {
  try {
    return localStorage.getItem('user_role') === 'admin';
  } catch (e) {
    return false;
  }
};

/**
 * Clears auth state - kept for compatibility with existing code
 */
export const clearAuth = (): void => {
  // Clear localStorage auth-related items
  localStorage.removeItem('is_authenticated');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_id');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_last_check');
  
  // Remove Authorization header
  delete apiClient.defaults.headers.common['Authorization'];
};