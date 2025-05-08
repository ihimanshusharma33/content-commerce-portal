export interface Course {
  id: number;
  title: string;
  instructor: string;
  students: number;
  rating: number;
  status: string;
  price: number;
  createdAt: string;
}

export interface Review {
  id: number;
  courseId: number;
  courseTitle: string;
  student: string;
  rating: number;
  content: string;
  status: string;
  date: string;
}

export interface Transaction {
  id: string;
  student: string;
  email: string;
  courseId: number;
  courseTitle: string;
  amount: number;
  date: string;
  status: string;
}

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  activeStudents: number;
  reviewsPending: number;
}