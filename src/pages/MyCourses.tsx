import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/utils/apiClient';
import { toast } from "@/components/ui/sonner";
import { Loader2 } from 'lucide-react';

const MyCourses = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth(); 
  const [purchasedCourses, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (authLoading) return;
  if (!user) {
    toast("Authentication required", {
      description: "Please sign in or create an account to purchase this course."
    });
    navigate('/signin', { state: { redirectTo: '/my-courses' } });
    return;
  }

  apiClient.get('/student/purchased-courses')
    .then((response) => {
      console.log(response.data);
      if (response.data.status) {
        const purchased = response.data.data
          .filter(item => item.course_or_subject_details)
          .map((item, index) => {
            const details = item.course_or_subject_details;
            return {
              id: item.course_or_subject_id,
              title: item.payment_type === 'course' ? details.course_name : details.subject_name,
              image: details.image,
              price: details.price,
              semester: item.payment_type === 'course' ? details.semester : '',
              rating: details.average_rating,
              reviewCount: details.total_reviews,
              type: item.payment_type,
              payment_id: details.id,
              isExpired:item.is_expired,
              expiryDaysLeft:item.days_left,
              localId: `${item.payment_type}-${item.course_or_subject_id}-${index}`, 
            };
          });

        setPurchasedItems(purchased);
      }
    })
    .catch((error) => {
      console.error('Failed to fetch purchase history:', error);
      toast("Failed to load your purchased courses.");
    })
    .finally(() => setLoading(false));
}, [user, navigate,authLoading]);
console.log(purchasedCourses);

  if (loading) return   <div className="flex justify-center items-center min-h-screen">
  <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
</div>;
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
          )  : purchasedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedCourses.map((course, index) => (
                <CourseCard
                  course={course}
                  course_or_subject={course.type}
                  isPurchased={true}
                  isExpired={course.isExpired}
                  expiryDaysLeft={course.expiryDaysLeft}
                  key={`${course.type}-${course.course_id}-${index}`} 
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
