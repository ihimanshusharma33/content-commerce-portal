
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { isAuthenticated, getCurrentUser, courses } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const user = getCurrentUser();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin', { state: { redirectTo: '/dashboard' } });
    }
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      setIsLoggedIn(isAuthenticated());
    };
    
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [navigate]);
  
  // Get purchased courses
  const purchasedCourses = courses.filter(course => 
    user?.purchasedCourses.includes(course.id)
  );
  
  if (!isLoggedIn || !user) {
    return null; // This will redirect, but prevents flash of content
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-secondary/20 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Track your learning progress here.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-10">
        <div className="container-custom">
          <Tabs defaultValue="my-courses" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="my-courses">My Courses</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-courses">
              {purchasedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedCourses.map(course => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      isPurchased={true} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">You haven't purchased any courses yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Browse our catalog and find the perfect course to start your learning journey
                  </p>
                  <button 
                    onClick={() => navigate('/courses')}
                    className="btn-primary"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="profile">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                      <p>{user.name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <p>{user.email}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Enrolled Courses</label>
                      <p>{user.purchasedCourses.length}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button className="btn-secondary">Edit Profile</button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="notifications" className="sr-only" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Course Updates</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="updates" className="sr-only" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Marketing Emails</span>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="marketing" className="sr-only" />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary"></div>
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button className="btn-secondary">Change Password</button>
                    <button className="text-red-600 hover:text-red-800 font-medium">Delete Account</button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
