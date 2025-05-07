import React, { useState, useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarSeparator,
  useSidebar
} from "@/components/ui/sidebar";
import { HomeIcon, HistoryIcon, Settings as SettingsIcon, LogOut, BookOpen, User, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Import our new components
import MyCourses from "./components/MyCourses";
import PurchaseHistory from "./components/PurchaseHistory";
import Settings from "./components/Settings";
import Profile from "./components/Profile";

// Mock data for purchased courses and purchase history
const purchasedCourses = [
  {
    id: "CS101",
    name: "Introduction to Computer Science",
    progress: 45,
    lastAccessed: "2025-05-01T10:30:00",
    instructor: "Dr. Smith",
  },
  {
    id: "CS102",
    name: "Data Structures",
    progress: 75,
    lastAccessed: "2025-05-03T14:15:00",
    instructor: "Dr. Johnson",
  },
  {
    id: "CS103",
    name: "Web Development",
    progress: 10,
    lastAccessed: "2025-05-04T09:45:00",
    instructor: "Dr. Brown",
  },
];

const purchaseHistory: { id: string; courseName: string; purchaseDate: string; expiryDate: string; status: "active" | "expired"; amount: number; }[] = [
  {
    id: "PUR-001",
    courseName: "Introduction to Computer Science",
    purchaseDate: "2025-01-15",
    expiryDate: "2025-07-15",
    status: "active",
    amount: 49.99,
  },
  {
    id: "PUR-002",
    courseName: "Data Structures",
    purchaseDate: "2025-02-20",
    expiryDate: "2025-08-20",
    status: "active",
    amount: 59.99,
  },
  {
    id: "PUR-003",
    courseName: "Web Development",
    purchaseDate: "2025-03-10",
    expiryDate: "2025-09-10",
    status: "active",
    amount: 69.99,
  },
  {
    id: "PUR-004",
    courseName: "Machine Learning Basics",
    purchaseDate: "2024-09-05",
    expiryDate: "2025-03-05",
    status: "expired",
    amount: 79.99,
  },
];

// Custom MenuButton component that uses the sidebar context correctly
const MenuButton = () => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <button
      onClick={toggleSidebar}
      className="p-2 rounded-md hover:bg-accent flex items-center justify-center"
      aria-label="Open sidebar"
    >
      <Menu className="size-5 text-muted-foreground hover:text-foreground" />
    </button>
  );
};

export const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "history" | "settings" | "profile">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  // Initialize sidebar based on screen size
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  // Student info for the profile section in sidebar
  const studentInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    enrolledSince: "Jan 2025"
  };

  // Calculate total investment
  const totalInvestment = purchaseHistory.reduce((acc, item) => acc + item.amount, 0).toFixed(2);

  return (
    <SidebarProvider
      defaultOpen={!isMobile}
      open={isSidebarOpen}
      onOpenChange={setIsSidebarOpen}
    >
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">{studentInfo.name.charAt(0)}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{studentInfo.name}</span>
                <span className="text-xs text-sidebar-foreground/70">Student</span>
              </div>
              <SidebarTrigger className="ml-auto">
                <X className="size-4" />
              </SidebarTrigger>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "dashboard"}
                  onClick={() => setActiveSection("dashboard")}
                  tooltip="Dashboard"
                >
                  <HomeIcon className="size-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "history"}
                  onClick={() => setActiveSection("history")}
                  tooltip="Purchase History"
                >
                  <HistoryIcon className="size-4" />
                  <span>Purchase History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "dashboard"}
                  onClick={() => setActiveSection("dashboard")}
                  tooltip="My Courses"
                >
                  <BookOpen className="size-4" />
                  <span>My Courses</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarSeparator />

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "settings"}
                  onClick={() => setActiveSection("settings")}
                  tooltip="Settings"
                >
                  <SettingsIcon className="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "profile"}
                  onClick={() => setActiveSection("profile")}
                  tooltip="Profile"
                >
                  <User className="size-4" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-destructive hover:text-destructive">
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset>
          <div className="container px-4 py-8 overflow-auto h-full">
            <div className="flex items-center justify-between mb-6">
              {!isSidebarOpen && (
                <MenuButton />
              )}
              <h1 className="text-3xl font-bold">
                {activeSection === "dashboard" && "Student Dashboard"}
                {activeSection === "history" && "Purchase History"}
                {activeSection === "settings" && "Settings"}
                {activeSection === "profile" && "My Profile"}
              </h1>
            </div>

            {/* Dashboard/Courses Section */}
            {activeSection === "dashboard" && (
              <MyCourses courses={purchasedCourses} />
            )}

            {/* History Section */}
            {activeSection === "history" && (
              <PurchaseHistory purchaseHistory={purchaseHistory} />
            )}

            {/* Settings Section */}
            {activeSection === "settings" && (
              <Settings studentInfo={studentInfo} />
            )}
            
            {/* Profile Section */}
            {activeSection === "profile" && (
              <Profile studentInfo={studentInfo} />
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;