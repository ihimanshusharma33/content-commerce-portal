import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from '@/components/CourseCard';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import apiClient from "@/utils/apiClient";
import { useAuth } from "@/contexts/AuthContext";

const FeaturedCourses = () => {
  const [visibleCourses, setVisibleCourses] = useState(3);
  const [courses, setcourses] = useState([]);
  const navigate = useNavigate();
  const featuredCourses = courses;
  const user = useAuth();
  const purchasedCourses = [];

  const showMoreCourses = () => {
    setVisibleCourses(prev => Math.min(prev + 3, featuredCourses.length));
  };

  useEffect(() => {
    apiClient.get('/featuredCourseOrSubject')
      .then((res) => {
        const featured = res.data.data;

        const mappedFeaturedCourses = featured.map((f: any) => {
          const isSubject = f.type === 'subject';
          const details = f.details;

          return {
            id: isSubject ? details.subject_id : details.course_id,
            type: f.type,
            title: isSubject ? details.subject_name : details.course_name,
            semester: isSubject ? '': details.semester,
            description: details.description || '',
            category: isSubject ? details.subject_id : details.course_id, 
            price: details.price || 0,
            rating: Number(details.average_rating || 0).toFixed(1), 
            image: details.image,
            reviewCount:details.total_reviews,
          };
        });

        setcourses(mappedFeaturedCourses);
      })
      .catch((err) => {
        console.error("Failed to fetch subjects:", err);
      });
  }, []);

  const handleQuickBuy = (course: typeof courses[0]) => {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in or create an account to purchase this course."
      });
      navigate('/signin', { state: { redirectTo: `/course/${course.id}` } });
      return;
    }
    navigate(`/checkout/${course.type}/${course.id}`);
  };

  return (
    <section className="py-10">

      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Courses</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, visibleCourses).map(course => (
            <div key={`${course.type}-${course.id}`} className="relative group">
              <CourseCard
                course={course}
                course_or_subject={course.type}
                isPurchased={purchasedCourses.includes(course.id)}
              />

              {!purchasedCourses.includes(course.id) && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickBuy(course);
                    }}
                    className="bg-accent text-white hover:bg-accent/90"
                  >
                    Buy Now
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {visibleCourses < courses.length && (
          <div className="mt-8 text-center">
            <Button onClick={showMoreCourses} variant="secondary">
              Show More Courses
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;
