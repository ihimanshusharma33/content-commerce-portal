import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { Loader2 } from 'lucide-react';
import apiClient from '@/utils/apiClient';
import { isAuthenticated } from '@/services/authService';

// Define course type
interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  discount_price?: number;
  instructor_name: string;
  rating?: number;
  total_videos?: number;
  total_hours?: number;
  level?: string;
  category?: string;
}

const MyCourses = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  
  // Fetch purchased courses from API
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      if (!isAuthenticated()) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Make API call to get user's purchased courses
        const response = await apiClient.get('/user/purchased-courses');
        
        if (response.data && response.status === 200) {
          // Extract courses data based on your API response structure
          const coursesData = response.data.data || response.data.courses || response.data;
          
          if (Array.isArray(coursesData)) {
            setPurchasedCourses(coursesData);
          } else {
            console.error('Unexpected API response format:', response.data);
            setError('Unexpected data format from server');
          }
        } else {
          setError('Failed to fetch your courses');
        }
      } catch (err: any) {
        console.error('Error fetching purchased courses:', err);
        setError(err.response?.data?.message || 'Could not load your courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPurchasedCourses();
  }, [isLoggedIn]);
  
  if (!isLoggedIn) {
    return null; // This will redirect, but prevents flash of content
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
    
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Courses</h1>
            <p className="text-muted-foreground">
              Access your purchased courses and continue your learning journey
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
              <span className="text-lg">Loading your courses...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6 text-center">
              <p className="mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : purchasedCourses.length > 0 ? (
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
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
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