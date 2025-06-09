import apiClient from "../utils/apiClient";
import { Transaction } from "../../types";

export interface Course {
  id: number;
  name: string;
  description?: string;
  semester: number;
  image?: string;
  createdAt?: string;
  price?: number | string;
  discount?: number | string;
  averageRating?: string;
  totalReviews?: number;
}

export interface Subject {
  id: number;
  name: string;
  courseId: number;
  semester?: number;
  resourceLink?: string | null;
  price?: string | number;
  discount?: string | number;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  price: subject.price,
  discount: subject.discount,
  image: subject.image,
  createdAt: subject.created_at,
  updatedAt: subject.updated_at
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

// Add this mapping function for User objects
const mapUserFromApi = (userData: any): User => ({
  id: userData.id || userData.user_id,
  name: userData.name,
  email: userData.email,
  role: userData.role,
  created_at: userData.created_at,
  updated_at: userData.updated_at
});

// Helper function to convert object to FormData
const convertToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value === null) {
        formData.append(key, ''); // Handle null values as empty strings
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
};

// Course Management

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
        price: course.price,
        discount: course.discount,
        averageRating: course.average_rating,
        totalReviews: course.total_reviews || 0
      }));
    }
    
    // Fallback in case the structure is different
    console.warn('Unexpected API response structure in fetchCourses:', response.data);
    return [];
  });

// Create a new course - updated to use FormData and handle the response structure
export const createCourse = (formData: FormData): Promise<Course> =>
  apiClient.post("/courses", formData).then((response) => {
    // Handle the nested response structure
    const courseData = response.data.data || response.data;
    return {
      id: courseData.course_id,
      name: courseData.course_name,
      description: courseData.description,
      semester: courseData.semester,
      image: courseData.image,
      createdAt: courseData.created_at,
      price: courseData.price,
      discount: courseData.discount
    };
  });

// Update a course - fixed to use POST with method override
export const updateCourse = (id: number, formData: FormData): Promise<Course> => {
  // Use POST with method override for multipart/form-data
  return apiClient.post(`/courses/${id}?_method=PUT`, formData).then((response) => {
    // Handle the nested response structure
    const courseData = response.data.data || response.data;
    return {
      id: courseData.course_id,
      name: courseData.course_name,
      description: courseData.description,
      semester: courseData.semester,
      image: courseData.image,
      createdAt: courseData.created_at,
      price: courseData.price,
      discount: courseData.discount
    };
  });
};

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
  apiClient.get(`/courses/${courseId}`).then((response) => {
    // Check if the response has the expected structure
    if (response.data && response.data.status && response.data.data && response.data.data.subjects) {
      return response.data.data.subjects.map(mapSubjectFromApi);
    } else if (response.data && response.data.subjects) {
      return response.data.subjects.map(mapSubjectFromApi);
    }
    
    // Fallback in case the structure is different
    console.warn('Unexpected API response structure in fetchSubjectsByCourse:', response.data);
    return [];
  });

// Create a new subject - convert to FormData
export const createSubject = (subject: Partial<Subject>): Promise<Subject> => {
  const formData = convertToFormData(mapSubjectToApi(subject));
  
  return apiClient.post("/subjects", formData)
    .then((response) => mapSubjectFromApi(response.data));
};

// Update an existing subject - convert to FormData and use POST with method override
export const updateSubject = (id: number, subject: Partial<Subject>): Promise<Subject> => {
  const formData = convertToFormData(mapSubjectToApi(subject));
  
  return apiClient.post(`/subjects/${id}?_method=PUT`, formData)
    .then((response) => mapSubjectFromApi(response.data));
};

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

// Create a new chapter - convert to FormData
export const createChapter = (chapter: Partial<Chapter>): Promise<Chapter> => {
  const formData = convertToFormData(mapChapterToApi(chapter));
  
  return apiClient.post("/chapters", formData)
    .then((response) => mapChapterFromApi(response.data));
};

// Update an existing chapter - convert to FormData and use POST with method override
export const updateChapter = (id: number, chapter: Partial<Chapter>): Promise<Chapter> => {
  const formData = convertToFormData(mapChapterToApi(chapter));
  
  return apiClient.post(`/chapters/${id}?_method=PUT`, formData)
    .then((response) => mapChapterFromApi(response.data));
};

// Delete a chapter - no changes needed
export const deleteChapter = (id: number): Promise<void> =>
  apiClient.delete(`/chapters/${id}`).then(() => undefined);


// ------------ Review Management ------------ //

// Fetch all pending reviews
export const fetchPendingReviews = (): Promise<Review[]> =>
  apiClient.get('/reviews').then((response) => {
    const data = response.data;
    return Array.isArray(data) ? data.map(mapReviewFromApi) : [mapReviewFromApi(data)];
  });

// Create a new review - convert to FormData
export const createReview = (review: Partial<Review>): Promise<Review> => {
  const formData = convertToFormData(mapReviewToApi(review));
  
  return apiClient.post("/reviews", formData)
    .then((response) => mapReviewFromApi(response.data));
};

// Update a review - convert to FormData and use POST with method override
export const updateReview = (id: number, review: Partial<Review>): Promise<Review> => {
  const formData = convertToFormData(mapReviewToApi(review));
  
  return apiClient.post(`/reviews/${id}?_method=PUT`, formData)
    .then((response) => mapReviewFromApi(response.data));
};

// Approve a review
export const approveReview = (id: number): Promise<void> =>
  apiClient.post(`/reviews/${id}/approve`).then(() => undefined);

// Reject a review
export const rejectReview = (id: number): Promise<void> =>
  apiClient.post(`/reviews/${id}/reject`).then(() => undefined);


// ------------ User Management ------------ //

// Create a new user (registration)
export const createUser = (userData: Partial<User>): Promise<User> => {
  const formData = convertToFormData({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });
  
  return apiClient.post('/signup', formData)
    .then(response => {
      if (response.data.status && response.data.data) {
        return mapUserFromApi(response.data.data);
      }
      return mapUserFromApi(response.data);
    });
};

// Update user - new function with FormData
export const updateUser = (id: number, userData: Partial<User>): Promise<User> => {
  const formData = convertToFormData({
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });
  
  return apiClient.post(`/users/${id}?_method=PUT`, formData)
    .then(response => {
      if (response.data.status && response.data.data) {
        return mapUserFromApi(response.data.data);
      }
      return mapUserFromApi(response.data);
    });
};

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

// Get user purchased courses - new function
export const getUserPurchasedCourses = async (): Promise<Course[]> => {
  try {
    const response = await apiClient.get('/user/purchased-courses');
    
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data.map((course: any) => ({
        id: course.course_id,
        name: course.course_name,
        description: course.description,
        semester: course.semester,
        image: course.image,
        createdAt: course.created_at,
      }));
    }
    
    console.warn('Unexpected API response structure in getUserPurchasedCourses:', response.data);
    return [];
  } catch (error) {
    console.error('Error fetching user purchased courses:', error);
    return [];
  }
};

// Add a function to get course details with subjects
export interface CourseDetails {
  name: string;
  description: string;
  price: string | number;
  semester: number;
  image: string;
  totalSubjects: number;
  subjects: Subject[];
  totalUsers: number;
  overallRating: string;
  totalReviewCount: number;
}

export const getCourseDetails = (courseId: number): Promise<CourseDetails> => 
  apiClient.get(`/courses/${courseId}`).then((response) => {
    if (response.data && response.data.status && response.data.data) {
      const data = response.data.data;
      return {
        name: data.course_name,
        description: data.course_description,
        price: data.price,
        semester: data.semester,
        image: data.image,
        totalSubjects: data.total_subjects,
        subjects: data.subjects.map(mapSubjectFromApi),
        totalUsers: data.total_users,
        overallRating: data.overall_rating,
        totalReviewCount: data.total_review_count
      };
    }
    
    throw new Error(response.data?.message || 'Failed to fetch course details');
  });

// Purchase a subject
export const purchaseSubject = (subjectId: number): Promise<any> => {
  const formData = convertToFormData({
    subject_id: subjectId
  });
  
  return apiClient.post('/purchase/subject', formData)
    .then(response => response.data);
};

// Get subject reviews
export const getSubjectReviews = (subjectId: number): Promise<any[]> => 
  apiClient.get(`/subjects/${subjectId}/reviews`)
    .then(response => {
      if (response.data && response.data.status && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    });

// Create a subject review
export const createSubjectReview = (subjectId: number, content: string, rating: number): Promise<any> => {
  const formData = convertToFormData({
    subject_id: subjectId,
    review_description: content,
    rating: rating
  });
  
  return apiClient.post('/subject-reviews', formData)
    .then(response => response.data);
};
 
export function getAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `https://amplifilearn.com/api/storage/app/public/${path.replace(/^\\\\+|^\\\\+/, "")}`;
}
