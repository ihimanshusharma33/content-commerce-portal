import { Course, Review, Transaction, DashboardStats, SidebarItem } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Star, 
  CreditCard, 
  Settings 
} from "lucide-react";
import React from "react";



export const mockStats: DashboardStats = {
  totalCourses: 24,
  totalStudents: 1287,
  totalRevenue: 52640.75,
  activeStudents: 843,
  reviewsPending: 12
};

export const mockCourses: Course[] = [
  { id: 1, title: "Complete JavaScript Course", instructor: "John Smith", students: 342, rating: 4.7, status: "active", price: 49.99, createdAt: "2023-05-15" },
  { id: 2, title: "Python for Data Science", instructor: "Sarah Johnson", students: 215, rating: 4.8, status: "active", price: 59.99, createdAt: "2023-06-22" },
  { id: 3, title: "React.js Masterclass", instructor: "Michael Brown", students: 178, rating: 4.5, status: "active", price: 39.99, createdAt: "2023-07-10" },
  { id: 4, title: "UI/UX Design Fundamentals", instructor: "Emma Davis", students: 156, rating: 4.6, status: "active", price: 29.99, createdAt: "2023-08-05" },
  { id: 5, title: "Advanced CSS and Sass", instructor: "David Wilson", students: 129, rating: 4.4, status: "draft", price: 34.99, createdAt: "2023-09-18" }
];

export const mockReviews: Review[] = [
  { id: 1, courseId: 1, courseTitle: "Complete JavaScript Course", student: "Alex Johnson", rating: 5, content: "This course was incredibly helpful! I went from knowing nothing about JavaScript to building complex applications.", status: "pending", date: "2023-10-05" },
  { id: 2, courseId: 3, courseTitle: "React.js Masterclass", student: "Jamie Smith", rating: 4, content: "Great content but some sections could be more detailed. Overall a good investment of time.", status: "pending", date: "2023-10-07" },
  { id: 3, courseId: 2, courseTitle: "Python for Data Science", student: "Taylor Brown", rating: 2, content: "The course was too basic for my needs. I expected more advanced topics to be covered.", status: "pending", date: "2023-10-08" },
  { id: 4, courseId: 4, courseTitle: "UI/UX Design Fundamentals", student: "Morgan Lee", rating: 5, content: "Amazing course! The instructor explained complex concepts in an easy to understand way.", status: "approved", date: "2023-10-01" }
];

export const mockTransactions: Transaction[] = [
  { id: "TX-78945", student: "Alex Johnson", email: "alex@example.com", courseId: 1, courseTitle: "Complete JavaScript Course", amount: 49.99, date: "2023-10-10", status: "completed" },
  { id: "TX-78946", student: "Jamie Smith", email: "jamie@example.com", courseId: 3, courseTitle: "React.js Masterclass", amount: 39.99, date: "2023-10-09", status: "completed" },
  { id: "TX-78947", student: "Taylor Brown", email: "taylor@example.com", courseId: 2, courseTitle: "Python for Data Science", amount: 59.99, date: "2023-10-08", status: "completed" },
  { id: "TX-78948", student: "Morgan Lee", email: "morgan@example.com", courseId: 4, courseTitle: "UI/UX Design Fundamentals", amount: 29.99, date: "2023-10-06", status: "completed" },
  { id: "TX-78949", student: "Casey Wilson", email: "casey@example.com", courseId: 1, courseTitle: "Complete JavaScript Course", amount: 49.99, date: "2023-10-05", status: "refunded" }
];
// Example export for sidebarItems
export const sidebarItems: SidebarItem[] = [
    { icon: React.createElement(LayoutDashboard, { className: "h-5 w-5" }), label: "Dashboard", id: "dashboard" },
    { icon: React.createElement(BookOpen, { className: "h-5 w-5" }), label: "Courses", id: "courses" },
    { icon: React.createElement(Users, { className: "h-5 w-5" }), label: "Students", id: "students" },
    { icon: React.createElement(Star, { className: "h-5 w-5" }), label: "Reviews", id: "reviews" },
    { icon: React.createElement(CreditCard, { className: "h-5 w-5" }), label: "Transactions", id: "transactions" },
    { icon: React.createElement(Settings, { className: "h-5 w-5" }), label: "Settings", id: "settings" },
  ];