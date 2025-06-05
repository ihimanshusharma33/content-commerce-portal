import apiClient from "../utils/apiClient";

import { Transaction } from "../../types";

export interface Course {
  id: number;
  name: string;
  description?: string;
  semester: number;
  image?: string;
  createdAt?: string;
}

export interface Subject {
  id: number;
  name: string;
  courseId: number;
  semester: number;
  resourceLink: string | null;
}

export interface Chapter {
  id: number;
  name: string;
  subjectId: number;
  content: string;
}

export interface Review {
  id: number;
  courseId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  rating: number;
  status: "pending" | "approved" | "rejected";
}

// Add this to the top of the file with other interfaces
export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

// Add this interface at the top with your other interfaces
export interface Stats {
  total_users: number;
  total_purchasing_users: number;
  total_purchases: number;
  total_courses: number;
  pending_course_reviews: number;
  pending_subject_reviews: number;
}

// Utility function to map snake_case to camelCase for Subject
const mapSubjectFromApi = (subject: any): Subject => ({
  id: subject.subject_id,
  name: subject.subject_name,
  courseId: subject.course_id,
  semester: subject.semester,
  resourceLink: subject.resource_link,
});

// Utility function to map camelCase to snake_case for Subject
const mapSubjectToApi = (subject: Partial<Subject>): any => ({
  subject_name: subject.name,
  course_id: subject.courseId,
  semester: subject.semester,
  resource_link: subject.resourceLink,
});


const mapChapterFromApi = (chapter: any): Chapter => ({
  id: chapter.chapter_id,
  name: chapter.chapter_name,
  subjectId: chapter.subject_id,
  content: chapter.content,
});

const mapChapterToApi = (chapter: Partial<Chapter>): any => ({
  chapter_name: chapter.name,
  subject_id: chapter.subjectId,
  content: chapter.content,
});

const mapReviewFromApi = (review: any): Review => ({
  id: review.review_id,
  courseId: review.course_id,
  content: review.review_description,
  userId: review.user_id,
  createdAt: review.created_at,
  updatedAt: review.updated_at,
  status: review.status,
  rating: review.rating,
});

const mapReviewToApi = (review: Partial<Review>): any => ({
  course_id: review.courseId,
  review_description: review.content,
  status: review.status,
  rating: review.rating,

});


// Course Management

// Add this mapping function with other mappers
const mapUserFromApi = (user: any): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.created_at,
  updated_at: user.updated_at,
});

// Fetch all courses
export const fetchCourses = (): Promise<Course[]> =>
  apiClient.get("/courses").then((response) => {
    // Check if the response has the expected structure
    if (response.data && response.data.status && Array.isArray(response.data.data)) {
      // Map the data array to our Course interface
      return response.data.data.map((course: any) => ({
        id: course.course_id,
        name: course.course_name,
        description: course.description,
        semester: course.semester,
        image: course.image, // API returns 'image' directly, not 'image_url'
        createdAt: course.created_at,
      }));
    }
    
    // Fallback in case the structure is different
    console.warn('Unexpected API response structure in fetchCourses:', response.data);
    return [];
  });

// Create a new course - updated to use FormData and handle the response structure
export const createCourse = (formData: FormData): Promise<Course> =>
  apiClient.post("/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((response) => {
    // Handle the nested response structure
    const courseData = response.data.data || response.data;
    return {
      id: courseData.course_id,
      name: courseData.course_name,
      description: courseData.description,
      semester: courseData.semester,
      image: courseData.image,
      createdAt: courseData.created_at,
    };
  });

// Update a course - updated to use FormData and handle the response structure
export const updateCourse = (id: number, formData: FormData): Promise<Course> =>
  apiClient.put(`/courses/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((response) => {
    // Handle the nested response structure
    const courseData = response.data.data || response.data;
    return {
      id: courseData.course_id,
      name: courseData.course_name,
      description: courseData.description,
      semester: courseData.semester,
      image: courseData.image,
      createdAt: courseData.created_at,
    };
  });

// Delete a course - handle the status response
export const deleteCourse = (id: number): Promise<void> =>
  apiClient.delete(`/courses/${id}`).then((response) => {
    // Check if the deletion was successful
    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to delete course');
    }
    return undefined;
  });

// Fetch subjects for a specific course
export const fetchSubjectsByCourse = (courseId: number): Promise<Subject[]> =>
  apiClient.get(`/courses/${courseId}`).then((response) =>
    response.data.subjects.map(mapSubjectFromApi)
  );

// Create a new subject
export const createSubject = (subject: Partial<Subject>): Promise<Subject> =>
  apiClient.post("/subjects", mapSubjectToApi(subject)).then((response) => mapSubjectFromApi(response.data));

// Update an existing subject
export const updateSubject = (id: number, subject: Partial<Subject>): Promise<Subject> =>
  apiClient.put(`/subjects/${id}`, mapSubjectToApi(subject)).then((response) => mapSubjectFromApi(response.data));

// Delete a subject
export const deleteSubject = (id: number): Promise<void> =>
  apiClient.delete(`/subjects/${id}`).then(() => undefined);


// ------------ Chapter Management ------------ //

// Fetch chapters by subject ID
export const fetchChaptersBySubject = (subjectId: number): Promise<Chapter[]> =>
  apiClient.get(`/chapters/subject/${subjectId}`).then((response) => {
    const data = response.data; // Access the 'data' field
    if (!data || !data.chapters) {
      throw new Error("Invalid API response: Missing chapters data");
    }
    return data.chapters.map((chapter: any) => ({
      id: chapter.chapter_id,
      name: chapter.chapter_name,
      subjectId: data.subject_details.subject_id, // Map subject ID from subject_details
      content: chapter.resource_link, // Assuming resource_link is the content
    }));
  });

// Create a new chapter
export const createChapter = (chapter: Partial<Chapter>): Promise<Chapter> =>
  apiClient.post("/chapters",mapChapterToApi(chapter) ).then((response) =>( mapChapterFromApi(response.data)));

// Update an existing chapter
export const updateChapter = (id: number, chapter: Partial<Chapter>): Promise<Chapter> =>
  apiClient.put(`/chapters/${id}`,mapChapterToApi(chapter)).then((response) => ( mapChapterFromApi(response.data)));

// Delete a chapter
export const deleteChapter = (id: number): Promise<void> =>
  apiClient.delete(`/chapters/${id}`).then(() => undefined);


// ------------ Review Management ------------ //

// Fetch all pending reviews
export const fetchPendingReviews = (): Promise<Review[]> =>
  apiClient.get('/reviews').then((response) => {
    const data = response.data;
    return Array.isArray(data) ? data.map(mapReviewFromApi) : [mapReviewFromApi(data)];
  });

// Approve a review
export const approveReview = (id: number): Promise<void> =>
  apiClient.post(`/reviews/${id}/approve`).then(() => undefined);

// Reject a review
export const rejectReview = (id: number): Promise<void> =>
  apiClient.post(`/reviews/${id}/reject`).then(() => undefined);


// ------------ User Management ------------ //

// Create a new user (registration)
export const createUser = (userData: Partial<User>): Promise<User> => 
  apiClient.post('/signup', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    // Add any other required fields for registration
  }).then(response => {
    // Handle the API response structure
    if (response.data.status && response.data.data) {
      return mapUserFromApi(response.data.data);
    }
    // If the API returns a different structure, adjust accordingly
    return mapUserFromApi(response.data);
  });

// This can be used to fetch the current user's profile
export const fetchUserProfile = (): Promise<User> =>
  apiClient.get('/user/profile').then(response => {
    // Handle the API response structure
    if (response.data.status && response.data.data) {
      return mapUserFromApi(response.data.data);
    }
    // If the API returns a different structure, adjust accordingly
    return mapUserFromApi(response.data);
  });

// ------------ Purchase History ------------ //


export const getPurchaseHistory = async (): Promise<Transaction[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    const response = await apiClient.get('/purchase-history', { headers });
    console.log('Purchase history response:', response);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return [];
  }
};

// Replace the incomplete fetchStatistics function
export const fetchStatistics = (): Promise<Stats> => 
  apiClient.get('/statistics').then((response) => {
    if (response.data && response.data.status) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to fetch statistics');
  });
