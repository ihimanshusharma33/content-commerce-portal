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
export interface SidebarItem {
  icon: ReactNode;
  label: string;
  id: string;
}

// Type for the sidebar items array
export type SidebarItems = SidebarItem[];