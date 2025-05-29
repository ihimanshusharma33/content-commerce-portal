import { useState } from "react";
import { Link } from "react-router-dom";
import { User, BookOpen, Star, CreditCard, Settings, LogOut, ChevronLeft, GraduationCap } from "lucide-react";
import { SidebarItem } from "../../../types"; // Reusing the type

// Student sidebar items with all required navigation options
export const studentSidebarItems: SidebarItem[] = [
  { icon: <User className="h-5 w-5" />, label: "Profile", id: "profile" },
  { icon: <BookOpen className="h-5 w-5" />, label: "My Courses", id: "my-courses" },
  { icon: <Star className="h-5 w-5" />, label: "My Reviews", id: "reviews" },
  { icon: <CreditCard className="h-5 w-5" />, label: "Payment History", id: "payment-history" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", id: "settings" },
];

interface StudentSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
  items?: SidebarItem[]; // Allow custom items to be passed in
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activeSection,
  setActiveSection,
  onLogout,
  items = studentSidebarItems
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <aside className={`bg-white border-r-2 relative h-[100vh] border-b-2 ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between w-full">
        <Link to="/student" className={`flex items-center space-x-2 ${!isSidebarOpen && 'justify-center'}`}>
          <GraduationCap className="h-6 w-6 text-blue-600" />
          {isSidebarOpen && <span className="font-bold font-md">Student Portal</span>}
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className={`h-5 w-5 transform transition-transform ${!isSidebarOpen && 'rotate-180'}`} />
        </button>
      </div>
      <div>
        
      </div>
      <div className="p-2 w-full bg-white">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full font-medium rounded-md flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 my-1 ${
              activeSection === item.id
                ? 'text-primary'
                : 'text-gray-600 hover:bg-secondary'
            }`}
          >
            {item.icon}
            {isSidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
          </button>
        ))}
      </div>
      <div className="absolute bottom-0 w-full p-4 border-t">
        <button
          onClick={onLogout}
          className={`w-full flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors`}
        >
          <LogOut className="h-5 w-5" />
          {isSidebarOpen && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;