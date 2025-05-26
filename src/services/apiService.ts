import { LoginCredentials, User } from "types";
import apiClient from "../utils/apiClient";

export interface Course {
  id: number;
  name: string;
  totalSemesters: number;
  createdAt: string;
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

const mapUserToApi = (user: Partial<User>): any => ({
  name: user.name,
  email: user.email,
  password: user.password,
  password_confirmation: user.password_confirmation,
});

// Fetch all courses
export const fetchCourses = (): Promise<Course[]> =>
  apiClient.get("/courses").then((response) =>
    response.data.map((course: any) => ({
      id: course.course_id,
      name: course.course_name,
      totalSemesters: course.total_semester,
      createdAt: course.created_at,
    }))
  );

// Create a new course
export const createCourse = (course: Partial<Course>): Promise<Course> =>
  apiClient.post("/courses", course).then((response) => response.data);

// Update an existing course
export const updateCourse = (courseId: number, course: Partial<Course>): Promise<Course> =>
  apiClient.put(`/courses/${courseId}`, course).then((response) => response.data);

// Delete a course
export const deleteCourse = (courseId: number): Promise<void> =>
  apiClient.delete(`/courses/${courseId}`).then(() => undefined);

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

// signup user
export const createUser = (user: Partial<User>): Promise<Subject> =>
  apiClient.post("/register", mapUserToApi(user)).then((response) => mapUserToApi(response.data));


const mapLoginCredentialsToApi = (credentials: Partial<LoginCredentials>): any => ({
  email: credentials.email,
  password: credentials.password,
});

export const loginUser = (credentials: Partial<LoginCredentials>): Promise<User> =>
  apiClient
    .post("/login", mapLoginCredentialsToApi(credentials))
    .then((response) => mapLoginCredentialsToApi(response.data)); 