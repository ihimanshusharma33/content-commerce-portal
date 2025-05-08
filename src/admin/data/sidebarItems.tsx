import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Star, 
  CreditCard, 
  Settings 
} from "lucide-react";

export const sidebarItems = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", id: "dashboard" },
  { icon: <BookOpen className="h-5 w-5" />, label: "Courses", id: "courses" },
  { icon: <Users className="h-5 w-5" />, label: "Students", id: "students" },
  { icon: <Star className="h-5 w-5" />, label: "Reviews", id: "reviews" },
  { icon: <CreditCard className="h-5 w-5" />, label: "Transactions", id: "transactions" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", id: "settings" },
];