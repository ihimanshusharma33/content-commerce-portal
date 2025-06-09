import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar, { studentSidebarItems } from "./components/StudentSidebar";
import StudentMobileMenu from "./components/StudentMobileMenu";
import { Menu, X, ArrowLeft } from "lucide-react";

// Import your components
import MyCourses from "./components/MyCourses";
import MyReviews from "./components/StudentReviews";
import PaymentHistory from "./components/PaymentHistory";
import Profile from "./components/StudentProfile";
import StudentSettings from "./components/StudentSettings";

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Listen for window resize events
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close mobile menu when resizing to desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuItemClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  const handleGoBack = () => {
    // navigate back to the home page or previous page
    navigate('/'); 
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header with Menu Toggle and Back Button - Only on mobile */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0 bg-white z-20">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <span className="ml-3 font-bold">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}</span>
          </div>
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Mobile Menu - Only render when on mobile and menu is open */}
      {isMobile && isMobileMenuOpen && (
        <StudentMobileMenu
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuItemClick={handleMobileMenuItemClick}
          onLogout={handleLogout}
          onClose={closeMobileMenu}
        />
      )}

      {/* Desktop Sidebar - Only on desktop */}
      {!isMobile && (
        <div className="w-auto flex-shrink-0">
          <StudentSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onLogout={handleLogout}
            items={studentSidebarItems}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-4 bg-white border-b">
          <button
            onClick={handleGoBack}
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Back</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          {/* Profile - Default View */}
          {activeSection === "profile" && (
            <Profile />
          )}

          {/* My Courses */}
          {activeSection === "my-courses" && (
            <MyCourses />
          )}

          {/* My Reviews */}
          {activeSection === "reviews" && (
            <MyReviews />
          )}

          {/* Payment History */}
          {activeSection === "payment-history" && (
            <PaymentHistory />
          )}

          {/* Settings */}
          {activeSection === "settings" && (
            <StudentSettings />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

