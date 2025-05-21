import apiClient from "../utils/apiClient";

export interface Course {
  id: number;
  name: string;
  totalSemesters: number;
}

// Fetch all courses
export const fetchCourses = (): Promise<Course[]> =>
  apiClient.get("/courses").then((response) =>
    response.data.map((course: any) => ({
      id: course.course_id,
      name: course.course_name,
      totalSemesters: course.total_semester,
    }))
  );

// Create a new course
export const createCourse = (course: Partial<Course>): Promise<Course> =>
  apiClient.post("/courses", course);

// Update an existing course
export const updateCourse = (id: number, course: Partial<Course>): Promise<Course> =>
  apiClient.put(`/courses/${id}`, course);

// Delete a course
export const deleteCourse = (id: number): Promise<void> =>
  apiClient.delete(`/courses/${id}`);