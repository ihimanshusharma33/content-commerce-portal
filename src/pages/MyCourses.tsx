import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { isAuthenticated, getCurrentUser, courses } from '@/lib/data';

const MyCourses = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const user = getCurrentUser();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin', { state: { redirectTo: '/my-courses' } });
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
    
      <main className="flex-grow py-8">
        <div className="container-custom">
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
            <div className="text-center py-12 bg-white rounded-lg shadow">
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyCourses;