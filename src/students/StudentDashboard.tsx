import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  SidebarSeparator
} from "@/components/ui/sidebar";
import { HomeIcon, HistoryIcon, Settings, LogOut, BookOpen, User } from "lucide-react";

interface PurchaseHistoryItem {
  id: string;
  courseName: string;
  purchaseDate: string;
  expiryDate: string;
  status: "active" | "expired";
  amount: number;
}

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

const purchaseHistory: PurchaseHistoryItem[] = [
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

export const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"dashboard" | "history" | "settings">("dashboard");
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Student info for the profile section in sidebar
  const studentInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    enrolledSince: "Jan 2025"
  };

  return (
    <SidebarProvider defaultOpen={true}>
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
                  <Settings className="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
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
            <div className="px-2 py-1">
              <SidebarTrigger className="ml-auto" />
            </div>
          </SidebarFooter>
        </Sidebar>
        
        {/* Main Content */}
        <SidebarInset>
          <div className="container px-4 py-8 overflow-auto h-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">
                {activeSection === "dashboard" && "Student Dashboard"}
                {activeSection === "history" && "Purchase History"}
                {activeSection === "settings" && "Settings"}
              </h1>
              <div className="md:hidden">
                <SidebarTrigger />
              </div>
            </div>
            
            {/* Dashboard Section */}
            {activeSection === "dashboard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Active Courses</CardTitle>
                      <CardDescription>Courses you are currently enrolled in</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{purchasedCourses.length}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Average Progress</CardTitle>
                      <CardDescription>Across all your courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {Math.round(
                          purchasedCourses.reduce((acc, course) => acc + course.progress, 0) / 
                          purchasedCourses.length
                        )}%
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">Total Investment</CardTitle>
                      <CardDescription>Amount spent on courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        ${purchaseHistory.reduce((acc, item) => acc + item.amount, 0).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <h2 className="text-2xl font-semibold mb-4">My Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedCourses.map((course) => (
                    <Card key={course.id} className="flex flex-col h-full">
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{course.name}</CardTitle>
                        <CardDescription>{course.instructor}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Last accessed: {formatDateTime(course.lastAccessed)}
                        </p>
                      </CardContent>
                      <div className="p-6 pt-0 mt-auto">
                        <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md">
                          Continue Learning
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
            
            {/* History Section */}
            {activeSection === "history" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                    <CardDescription>All your transactions and course purchases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-muted">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Course
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Purchase Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Expiry Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-card divide-y divide-gray-200">
                            {purchaseHistory.map((item) => (
                              <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  {item.courseName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                  {formatDate(item.purchaseDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                  {formatDate(item.expiryDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Badge variant={item.status === "active" ? "default" : "destructive"}>
                                    {item.status === "active" ? "Active" : "Expired"}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                  ${item.amount.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Responsive mobile view for purchase history (visible on small screens) */}
                      <div className="md:hidden">
                        {purchaseHistory.map((item) => (
                          <div key={item.id} className="border-t p-4">
                            <div className="font-medium">{item.courseName}</div>
                            <div className="mt-1 flex justify-between">
                              <span className="text-sm text-muted-foreground">Purchase:</span>
                              <span className="text-sm">{formatDate(item.purchaseDate)}</span>
                            </div>
                            <div className="mt-1 flex justify-between">
                              <span className="text-sm text-muted-foreground">Expires:</span>
                              <span className="text-sm">{formatDate(item.expiryDate)}</span>
                            </div>
                            <div className="mt-1 flex justify-between">
                              <span className="text-sm text-muted-foreground">Amount:</span>
                              <span className="text-sm">${item.amount.toFixed(2)}</span>
                            </div>
                            <div className="mt-2">
                              <Badge variant={item.status === "active" ? "default" : "destructive"}>
                                {item.status === "active" ? "Active" : "Expired"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {/* Settings Section */}
            {activeSection === "settings" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences and notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                          <input 
                            type="text" 
                            id="name"
                            defaultValue={studentInfo.name}
                            className="w-full rounded-md border border-input px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
                          <input 
                            type="email" 
                            id="email"
                            defaultValue={studentInfo.email}
                            className="w-full rounded-md border border-input px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Notification Settings</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <label htmlFor="course-updates" className="block text-sm font-medium">
                              Course Updates
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications about course content updates
                            </p>
                          </div>
                          <div>
                            <input 
                              type="checkbox"
                              id="course-updates"
                              defaultChecked={true}
                              className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <label htmlFor="promotions" className="block text-sm font-medium">
                              Promotional Emails
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Receive emails about discounts and special offers
                            </p>
                          </div>
                          <div>
                            <input 
                              type="checkbox"
                              id="promotions"
                              defaultChecked={false}
                              className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-offset-0 focus:ring-primary focus:ring-opacity-20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-md">
                        Save Changes
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;