import apiClient from "../utils/apiClient";
import { Transaction } from "../../types";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch student profile
export const getStudentProfile = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await apiClient.get('/student/profile', { headers });
    console.log('Student profile API response:', response.data); // Debug log
    
    if (response.data && response.data.status  && response.data.data) {
      return response.data.data;
    }
    
    // If we have data but status check failed, still try to return the data
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    throw new Error('Invalid response format or missing data');
  } catch (error: any) {
    console.error('Error fetching student profile:', error);
    // Don't re-throw if it's our own error from success message
    if (error.message && error.message.includes('Profile retrieved successfully')) {
      throw new Error('Failed to fetch student profile - invalid response format');
    }
    throw error;
  }
};

// Update student profile
export const updateStudentProfile = async (profileData: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}) => {
  try {
    const headers = getAuthHeaders();
    const response = await apiClient.put('/student/profile', profileData, { headers });
    if (response.data && response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update student profile');
  } catch (error) {
    console.error('Error updating student profile:', error);
    throw error;
  }
};

// Change student password
export const changeStudentPassword = async (passwordData: {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}) => {
  try {
    const headers = getAuthHeaders();
    const response = await apiClient.post('/student/change-password', passwordData, { headers });
    if (response.data && response.data.status === 'success') {
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to change password');
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Fetch purchased courses for the authenticated student
export const getStudentPurchasedCourses = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await apiClient.get('/student/purchased-courses', { headers });
    if (response.data && response.data.status) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching student purchased courses:', error);
    return [];
  }
};

// Fetch payment history for the authenticated student
export const getStudentPaymentHistory = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await apiClient.get('/user-purchase-history', { headers });
    if (response.data && response.data.status ) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching student payment history:', error);
    return [];
  }
};

// Fetch student reviews
export const getStudentReviews = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await apiClient.get('/student/my-reviews', { headers });
    if (response.data && response.data.status) {
      return response.data.data;
    }
    return { course_reviews: [], subject_reviews: [] };
  } catch (error) {
    console.error('Error fetching student reviews:', error);
    return { course_reviews: [], subject_reviews: [] };
  }
};
