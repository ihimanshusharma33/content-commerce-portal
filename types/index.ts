import { ReactNode } from "react";

export interface Course {
  id: number | string;
  name?: string;
  total_semesters: number;
  created_at: string;
  updated_at?: string;
  subjects: Subject[];
}


export interface Subject {
  id: number | string;
  name: string;
  semester: number;
  courseId:number;
}


export interface Chapter {
  id: number | string;
  title: string;
  content?: string;
  file_name?: string;
  file_size?: number;
}

export interface BaseReview {
  id: number;
  user_id: number;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  student_name?: string;
}

export interface CourseReview extends BaseReview {
  course_id: number;
  course_name?: string;
}

export interface SubjectReview extends BaseReview {
  subject_id: number;
  subject_name?: string;
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
  id: number;
  user_id: number;
  payment_type: 'course' | 'subject';
  course_or_subject_id: string;
  transaction_id: string;
  merchant_transaction_id: string | null;
  amount: string;
  status: 'initiated' | 'success' | 'failed' | 'refunded';
  purchased_at: string;
  created_at: string;
  updated_at: string;
  course_or_subject?: {
    course_id?: number;
    course_name?: string;
    image?: string;
    description?: string | null;
    semester?: number;
    created_at?: string;
    updated_at?: string;
    subject_id?: number;
    subject_name?: string;
  } | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  activeStudents: number;
  reviewsPending: number;
}
export interface SidebarItem {
  icon: ReactNode;
  label: string;
  id: string;
}

// Type for the sidebar items array
export type SidebarItems = SidebarItem[];

export interface User {
  id: number | string;
  name: string;
  email: string;
  password: string;
  password_confirmation:string;
}

export interface LoginResponse {
  token: string; 
  user: User;    
}

export interface LoginCredentials {
  email: string;
  password: string;
}