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
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./students/StudentDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminDashboard from "./admin/AdminDashoboard";
import PDFViewerPage from "./pages/PDFViewerPage";
import MyCourses from "./pages/MyCourses";
import PaymentPage from "./pages/PaymentPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import WhatsAppButton from "./components/WhatsAppButton";
import SubjectDetail from "./pages/SubjectDetail";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/course/:id/content" element={<CourseContent />} />
            <Route path="/subject/:id" element={<SubjectDetail />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
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
            <Route path="/pdf/:pdfId" element={<PDFViewerPage />} />
            <Route path="/pdf-viewer" element={<PDFViewerPage />} />
            <Route path="/checkout/:courseOrSubject/:courseId" element={<PaymentPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
     <WhatsAppButton />
  </QueryClientProvider>
);

export default App;
