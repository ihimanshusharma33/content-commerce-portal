import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import MobileMenu from './components/MobileMenu';
import DashboardSection from './sections/DashboardSection';
import CoursesSection from './sections/CoursesSection';
import ReviewsSection from './sections/ReviewsSection';
import TransactionsSection from './sections/TransactionsSection';
import { mockStats, mockCourses, mockReviews, mockTransactions } from './data/mockData';
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

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for various dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  // Stats for dashboard
  const [stats, setStats] = useState(mockStats);
  const [courses, setCourses] = useState(mockCourses);
  const [reviews, setReviews] = useState(mockReviews);
  const [transactions, setTransactions] = useState(mockTransactions);
  
  // Effect to simulate data loading
  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setStats(mockStats);
    setCourses(mockCourses);
    setReviews(mockReviews);
    setTransactions(mockTransactions);
  }, []);
  
  // Handlers for various actions
  const handleDeleteCourse = (courseId: number) => {
    setCourses(courses.filter(course => course.id !== courseId));
    setIsDeleteDialogOpen(false);
  };
  
  const handleApproveReview = (reviewId: number) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? {...review, status: "approved"} : review
    ));
  };
  
  const handleRejectReview = (reviewId: number) => {
    setReviews(reviews.map(review => 
      review.id === reviewId ? {...review, status: "rejected"} : review
    ));
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
      <div className="md:block hidden">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          onLogout={handleLogout}
        />
      </div>
      
      {/* Mobile Header */}
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
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden md:ml-0">
        <div className="p-6 md:p-8 mt-14 md:mt-0">
          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <DashboardSection 
              stats={stats}
              courses={courses}
              reviews={reviews}
              onSetActiveSection={setActiveSection}
              onApproveReview={handleApproveReview}
              onRejectReview={handleRejectReview}
              onViewAllCourses={() => setActiveSection("courses")}
              onViewAllReviews={() => setActiveSection("reviews")}
            />
          )}
          
          {/* Courses Section */}
          {activeSection === "courses" && (
            <CoursesSection 
              courses={courses}
              onDeleteCourse={handleDeleteCourseClick}
            />
          )}
          
          {/* Reviews Section */}
          {activeSection === "reviews" && (
            <ReviewsSection 
              reviews={reviews}
              onApproveReview={handleApproveReview}
              onRejectReview={handleRejectReview}
            />
          )}
          
          {/* Transactions Section */}
          {activeSection === "transactions" && (
            <TransactionsSection 
              transactions={transactions}
            />
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
             <h2 className="text-2xl font-bold">setting</h2>
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