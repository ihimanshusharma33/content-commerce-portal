import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStatistics } from '@/services/apiService';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import MobileMenu from './components/MobileMenu';
import DashboardSection from './sections/DashboardSection';
import CoursesSection from './sections/CoursesSection';
import ReviewsSection from './sections/ReviewsSection';
import TransactionsSection from './sections/TransactionsSection';
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Define Stats interface to match the API response structure
export interface Stats {
  total_users: number;
  new_users_today: number;
  total_users_this_week: number;
  total_users_this_month: number;
  total_purchasing_users: number;
  total_revenue: string;
  total_failed_transactions: number;
  total_pending_transactions: number;
  total_success_purchase_today: number;
  total_purchases: number;
  total_revenue_today: string;
  total_revenue_this_week: string;
  total_revenue_this_month: string;
  total_courses: number;
  total_subjects: number;
  total_chapters: number;
  pending_course_reviews: number;
  pending_subject_reviews: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for various dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  // Stats for dashboard
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  useEffect(() => {
    const loadStatistics = async () => {
      setIsLoadingStats(true);
      try {
        const statsData = await fetchStatistics();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to load statistics:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };
  
    // Load data when component mounts
    loadStatistics();
  }, []);
  
  // Handlers for various actions
  const handleDeleteCourse = (courseId: number) => {
    // Implementation will be updated when actual API is connected
    setIsDeleteDialogOpen(false);
  };
  
  const handleApproveReview = (reviewId: number) => {
    // Implementation will be updated when actual API is connected
  };
  
  const handleRejectReview = (reviewId: number) => {
    // Implementation will be updated when actual API is connected
  };

  const handleLogout = () => {
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuItemClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const handleDeleteCourseClick = (course: any) => {
    setSelectedCourse(course);
    setIsDeleteDialogOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <div className="md:block hidden md:sticky md:top-0 md:h-screen">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          onLogout={handleLogout}
        />
      </div>
      
      {/* Mobile Header - Fixed at top on mobile */}
      <MobileHeader 
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* Mobile Menu - Full Width Sidebar for small screens */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full fixed top-14 left-0 z-20 h-full bg-white">
          <MobileMenu 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isMobileMenuOpen={isMobileMenuOpen}
            onMobileMenuItemClick={handleMobileMenuItemClick}
            onLogout={handleLogout}
          />
        </div>
      )}
      
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden h-screen md:h-auto">
        <div className="p-6 md:p-8 mt-14 md:mt-0 min-h-[calc(100vh-56px)] md:min-h-screen">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <DashboardSection 
              stats={stats}
              isLoading={isLoadingStats}
              onSetActiveSection={setActiveSection}
              onApproveReview={handleApproveReview}
              onRejectReview={handleRejectReview}
              onViewAllCourses={() => setActiveSection("courses")}
              onViewAllReviews={() => setActiveSection("reviews")}
              onViewAllTransactions={() => setActiveSection("transactions")}
              onViewAllStudents={() => setActiveSection("students")}
            />
          )}
          
          {/* Courses Section */}
          {activeSection === "courses" && (
            <CoursesSection />
          )}
          
          {/* Reviews Section */}
          {activeSection === "reviews" && (
            <ReviewsSection />
          )}
          
          {/* Transactions Section */}
          {activeSection === "transactions" && (
            <TransactionsSection />
          )}
          
          {/* Students Section */}
          {activeSection === "students" && (
            <div>
              <h2 className="text-2xl font-bold">Students</h2>
              <p>Student management features will be implemented here.</p>
            </div>
          )}
          
          {/* Settings Section */}
          {activeSection === "settings" && (
             <div>
             <h2 className="text-2xl font-bold">Settings</h2>
             <p>Settings management features will be implemented here.</p>
           </div>
          )}
        </div>
      </div>
      
      {/* Delete Course Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this course?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the course
              "{selectedCourse?.title}" and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedCourse && handleDeleteCourse(selectedCourse.id)}
            >
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;