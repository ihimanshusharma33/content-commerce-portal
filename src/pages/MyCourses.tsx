import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/utils/apiClient';
import { toast } from "@/components/ui/sonner";

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
              localId: `${item.payment_type}-${item.course_or_subject_id}-${index}`, // unique key
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


  if (loading) return "Loading...";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container-custom">
          {purchasedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedCourses.map((course, index) => (
                <CourseCard
                  course={course}
                  course_or_subject={course.type}
                  isPurchased={true}
                  key={`${course.type}-${course.course_id}-${index}`} 
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
