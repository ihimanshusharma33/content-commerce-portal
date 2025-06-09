import apiClient from "../utils/apiClient";
import { CourseReview, SubjectReview } from "../../types";

// Helper functions to map between API and frontend formats
const mapCourseReviewFromApi = (review: any): CourseReview => {
  // Handle different possible response structures
  const reviewData = review.data || review;
  
  // Map is_approved (0/1) to status (pending/approved)
  let status = 'pending';
  if (reviewData.is_approved === 1 || reviewData.is_approved === true || reviewData.status === 'approved') {
    status = 'approved';
  }
  
  return {
    id: reviewData.id || reviewData.review_id,
    user_id: reviewData.user_id,
    course_id: reviewData.course_id,
    rating: reviewData.rating || 0,
    content: reviewData.content || reviewData.review_content || reviewData.review_description || '',
    is_approved: reviewData.is_approved,
    created_at: reviewData.created_at || new Date().toISOString(),
    updated_at: reviewData.updated_at || new Date().toISOString(),
    student_name: reviewData.student_name || reviewData.user?.name || 'Anonymous',
    course_name: reviewData.course_name || reviewData.course?.name || `Course #${reviewData.course_id}`
  };
};

const mapSubjectReviewFromApi = (review: any): SubjectReview => {
  // Handle different possible response structures
  const reviewData = review.data || review;
  
  // Map is_approved (0/1) to status (pending/approved)
  let status = 'pending';
  if (reviewData.is_approved === 1 || reviewData.is_approved === true || reviewData.status === 'approved') {
    status = 'approved';
  }
  
  return {
    id: reviewData.id || reviewData.review_id,
    user_id: reviewData.user_id,
    subject_id: reviewData.subject_id,
    rating: reviewData.rating || 0,
    content: reviewData.content || reviewData.review_content || reviewData.description || '',
    status: status,
    is_approved: reviewData.is_approved,
    created_at: reviewData.created_at || new Date().toISOString(),
    updated_at: reviewData.updated_at || new Date().toISOString(),
    student_name: reviewData.student_name || reviewData.user?.name || 'Anonymous',
    subject_name: reviewData.subject_name || reviewData.subject?.name || `Subject #${reviewData.subject_id}`
  };
};

// Extract response data safely
const getResponseData = (response: any): any[] => {
  // Check for common response patterns
  if (response?.data?.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else if (response?.data?.data) {
    return [response.data.data];
  } else if (response?.data && Array.isArray(response.data)) {
    return response.data;
  } else if (response?.data) {
    return [response.data];
  } else {
    return [];
  }
};

// Course Review API Operations
export const createCourseReview = async (courseId: number, rating: number, content: string): Promise<CourseReview> => {
  try {
    // Add auth token to request if available
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await apiClient.post('/coursereviews', {
      course_id: courseId,
      rating,
      content
    }, { headers });
    
    console.log('Create course review response:', response);
    return mapCourseReviewFromApi(response.data.data || response.data);
  } catch (error) {
    console.error('Error creating course review:', error);
    throw error;
  }
};

export const getCourseReviews = async (): Promise<CourseReview[]> => {
  try {
    const response = await apiClient.get('/coursereviews');
    console.log('Get course reviews response:', response);
    const reviews = getResponseData(response);
    return reviews.map(mapCourseReviewFromApi);
  } catch (error) {
    console.error('Error getting course reviews:', error);
    return [];
  }
};

export const getReviewsByCourseId = async (courseId: number): Promise<CourseReview[]> => {
  try {
    const response = await apiClient.get(`/coursereviews/course/${courseId}`);
    console.log(`Get reviews for course ${courseId} response:`, response);
    const reviews = getResponseData(response);
    return reviews.map(mapCourseReviewFromApi);
  } catch (error) {
    console.error(`Error getting reviews for course ${courseId}:`, error);
    return [];
  }
};

export const approveCourseReview = async (reviewId: number): Promise<CourseReview> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await apiClient.put(`/coursereviews/${reviewId}/approve`, {}, { headers });
    console.log(`Approve course review ${reviewId} response:`, response);
    return mapCourseReviewFromApi(response.data.data || response.data);
  } catch (error) {
    console.error(`Error approving course review ${reviewId}:`, error);
    throw error;
  }
};

export const deleteCourseReview = async (reviewId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    await apiClient.delete(`/coursereviews/${reviewId}`, { headers });
    console.log(`Delete course review ${reviewId} success`);
  } catch (error) {
    console.error(`Error deleting course review ${reviewId}:`, error);
    throw error;
  }
};

export const getApprovedCourseReviews = async (): Promise<CourseReview[]> => {
  try {
    const response = await apiClient.get('/coursereviews/approved');
    console.log('Get approved course reviews response:', response);
    const reviews = getResponseData(response);
    return reviews.map(mapCourseReviewFromApi);
  } catch (error) {
    console.error('Error getting approved course reviews:', error);
    return [];
  }
};

// Subject Review API Operations
export const createSubjectReview = async (subjectId: number, rating: number, content: string): Promise<SubjectReview> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await apiClient.post('/subjectreviews', {
      subject_id: subjectId,
      rating,
      content
    }, { headers });
    
    console.log('Create subject review response:', response);
    return mapSubjectReviewFromApi(response.data.data || response.data);
  } catch (error) {
    console.error('Error creating subject review:', error);
    throw error;
  }
};

export const getSubjectReviews = async (): Promise<SubjectReview[]> => {
  try {
    const response = await apiClient.get('/subjectreviews');
    console.log('Get subject reviews response:', response);
    const reviews = getResponseData(response);
    return reviews.map(mapSubjectReviewFromApi);
  } catch (error) {
    console.error('Error getting subject reviews:', error);
    return [];
  }
};

export const getReviewsBySubjectId = async (subjectId: number): Promise<SubjectReview[]> => {
  try {
    const response = await apiClient.get(`/subjectreviews/subject/${subjectId}`);
    console.log(`Get reviews for subject ${subjectId} response:`, response);
    const reviews = getResponseData(response);
    return reviews.map(mapSubjectReviewFromApi);
  } catch (error) {
    console.error(`Error getting reviews for subject ${subjectId}:`, error);
    return [];
  }
};

export const approveSubjectReview = async (reviewId: number): Promise<SubjectReview> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await apiClient.put(`/subjectreviews/${reviewId}/approve`, {}, { headers });
    console.log(`Approve subject review ${reviewId} response:`, response);
    return mapSubjectReviewFromApi(response.data.data || response.data);
  } catch (error) {
    console.error(`Error approving subject review ${reviewId}:`, error);
    throw error;
  }
};

export const deleteSubjectReview = async (reviewId: number): Promise<void> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    await apiClient.delete(`/subjectreviews/${reviewId}`, { headers });
    console.log(`Delete subject review ${reviewId} success`);
  } catch (error) {
    console.error(`Error deleting subject review ${reviewId}:`, error);
    throw error;
  }
};

export const getApprovedSubjectReviews = async (): Promise<SubjectReview[]> => {
  try {
    const response = await apiClient.get('/subjectreviews/approved');
    console.log('Get approved subject reviews response:', response);
    const reviews = getResponseData(response);
    return reviews.map(mapSubjectReviewFromApi);
  } catch (error) {
    console.error('Error getting approved subject reviews:', error);
    return [];
  }
};

export async function fetchMyReviews() {
  const response = await apiClient.get("/student/my-reviews");
  if (response.data.status !== "success") throw new Error(response.data.message || "Failed to fetch reviews");
  return response.data.data;
}