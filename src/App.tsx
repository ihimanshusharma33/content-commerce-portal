import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CourseList from "./pages/CourseList";
import CourseDetail from "./pages/CourseDetail";
import CourseContent from "./pages/CourseContent";
import CourseSubjects from "./pages/CourseSubjects"; // Ensure the file './pages/CourseSubjects.tsx' exists and is correctly named.
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./students/StudentDashboard";
import AdminDashboard from "./admin/AdminDashoboard";
import MyCourses from "./pages/MyCourses";
import PaymentPage from "./pages/PaymentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import WhatsAppButton from "./components/WhatsAppButton";
import SubjectDetail from "./pages/SubjectDetail";
import PaymentStatus from "./pages/PaymentStatus";

const queryClient = new QueryClient();

function App() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  // Detect DevTools
  useEffect(() => {
    let threshold = 160;
    let check = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      if (
        widthThreshold ||
        heightThreshold ||
        (window as any).firebug ||
        (window as any).devtools
      ) {
        setDevToolsOpen(true);
      } else {
        setDevToolsOpen(false);
      }
    };
    window.addEventListener('resize', check);
    const interval = setInterval(check, 1000);
    check();
    return () => {
      window.removeEventListener('resize', check);
      clearInterval(interval);
    };
  }, []);

  // Disable right-click and shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) || // Ctrl+Shift+I/J/C
        (e.ctrlKey && e.key === 'U') || // Ctrl+U
        (e.key === 'F12')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (devToolsOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">DevTools Detected</h2>
          <p className="text-gray-700">Please close your browser's developer tools to view this content.</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/course/:courseId/subjects" element={<CourseSubjects />} />
              <Route path="/subject/:subjectId/content" element={<CourseContent />} />
              <Route path="/chapter/:id/content" element={<CourseContent />} />
              <Route path="/subject/:id" element={<SubjectDetail />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
              <Route
                path="/admin-dashboard"
                element={
                  <AdminDashboard />
                }
              />
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/checkout/:courseOrSubject/:courseId" element={<PaymentPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
      <WhatsAppButton />
    </QueryClientProvider>
  );
}

export default App;
