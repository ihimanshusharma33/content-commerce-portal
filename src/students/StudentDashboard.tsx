import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./components/StudentSidebar";
import { Star, BookOpen, CreditCard, User, Settings } from "lucide-react";

import MyCourses from "./components/MyCourses";
import MyReviews from "./components/StudentReviews";
import PaymentHistory from "./components/PaymentHistory";
import StudentSettings from "./components/StudentSettings";
import Profile from "./components/StudentProfile";
import Navbar from "@/components/Navbar";

// Optional: Update studentSidebarItems with all available sections
const studentSidebarItems = [
  { icon: <User className="h-5 w-5" />, label: "Profile", id: "profile" },
  { icon: <BookOpen className="h-5 w-5" />, label: "My Courses", id: "my-courses" },
  { icon: <Star className="h-5 w-5" />, label: "My Reviews", id: "reviews" },
  { icon: <CreditCard className="h-5 w-5" />, label: "Payment History", id: "payment-history" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", id: "settings" },
];
interface User {
  id: number;
  name: string;
  email: string;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-[90vh]  bg-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <StudentSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
        items={studentSidebarItems}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden md:ml-0">
        <div className="p-6 md:p-8 mt-14 md:mt-0">
          {/* Dashboard Home */}
          
          {/* My Courses */}
          {activeSection === "my-courses" && (
            <MyCourses courses={[]} />
          )}
          
          {/* My Reviews */}
          {activeSection === "reviews" && (
            <MyReviews reviews={[]} />
          )}
          
          {/* Payment History */}
          {activeSection === "payment-history" && (
            <PaymentHistory payments={[]} />
          )}
          
          {/* Profile */}
          {activeSection === "profile" && (
            <Profile user={{ name: "John Doe", email: "john.doe@example.com", purchasedCourses: [] }} /> // 'id' is now valid
          )}
          
          {/* Settings */}
          {activeSection === "settings" && (
            <StudentSettings />
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default StudentDashboard;
