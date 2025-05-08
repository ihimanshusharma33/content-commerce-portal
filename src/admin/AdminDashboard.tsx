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
  useSidebar,
} from "@/components/ui/sidebar";
import { HomeIcon, HistoryIcon, LogOut, BookOpen, User, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Import the section components
import DashboardSection from "./components/DashboardSection";
import PaymentSection from "./components/PaymentSection";
import CoursesSection from "./components/CoursesSection";
import UserAccessSection from "./components/UserAccessSection";

// Custom MenuButton component
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

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "courses" | "payment" | "useraccess">("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  const adminInfo = {
    name: "Admin 1",
    email: "admin@gmail.com",
  };

  return (
    <SidebarProvider defaultOpen={!isMobile} open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-2">
              <div className="rounded-full bg-primary h-8 w-8 flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">{adminInfo.name.charAt(0)}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">{adminInfo.name}</span>
                <span className="text-xs text-sidebar-foreground/70">Admin</span>
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
                  isActive={activeSection === "payment"}
                  onClick={() => setActiveSection("payment")}
                  tooltip="Purchase History"
                >
                  <HistoryIcon className="size-4" />
                  <span>Purchase History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "courses"}
                  onClick={() => setActiveSection("courses")}
                  tooltip="My Courses"
                >
                  <BookOpen className="size-4" />
                  <span>My Courses</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarSeparator />

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "useraccess"}
                  onClick={() => setActiveSection("useraccess")}
                  tooltip="User Access"
                >
                  <User className="size-4" />
                  <span>Users Access</span>
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
              {!isSidebarOpen && <MenuButton />}
              <h1 className="text-3xl font-bold">
                {activeSection === "dashboard" && "Admin Dashboard"}
                {activeSection === "payment" && "Purchase History"}
                {activeSection === "courses" && "Courses"}
                {activeSection === "useraccess" && "Users Access"}
              </h1>
            </div>

            {activeSection === "dashboard" && <DashboardSection />}
            {activeSection === "payment" && <PaymentSection />}
            {activeSection === "courses" && <CoursesSection />}
            {activeSection === "useraccess" && <UserAccessSection />}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;