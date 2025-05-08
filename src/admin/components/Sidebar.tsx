import { useState } from "react";
import { Link } from "react-router-dom";
import { HomeIcon, BookOpen, Star, CreditCard, User, Settings, LogOut, ChevronRight, GraduationCap, ChevronLeft } from "lucide-react";
// Adjust the path as needed
import { SidebarItem} from "../../admin/types"; // Reusing the type
import { sidebarItems } from "../../admin/data/sidebarItems"; // Importing sidebar items

interface StudentSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onLogout: () => void;
  items?: SidebarItem[]; // Allow custom items to be passed in
}

const Sidebar: React.FC<StudentSidebarProps> = ({
  activeSection,
  setActiveSection,
  onLogout,
  items = sidebarItems // Default to student items if not provided
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <aside className={`bg-white hidden border-r-2 relative h-[100vh] border-b-2 h-full md:block ${isSidebarOpen ? 'md:w-64' : 'md:w-20'} transition-all duration-300 w-full`}>
      <div className="p-4 flex items-center justify-between w-full">
        <Link to="/student" className={`flex items-center space-x-2 ${!isSidebarOpen && 'justify-center'}`}>
          <GraduationCap className="h-6 w-6 text-blue-600" />
          {isSidebarOpen && <span className="font-bold font-md">Admin Dasboard</span>}
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className={`h-5 w-5 transform transition-transform ${!isSidebarOpen && 'rotate-180'}`} />
        </button>
      </div>

      <div className="p-2 w-full bg-white">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full font-medium  rounded-md flex items-center ${isSidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 my-1  ${activeSection === item.id
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

export default Sidebar;