
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from '@/components/CourseCard';
import { courses, getCurrentUser } from '@/lib/data';
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/PaymentModal";
import { toast } from "@/components/ui/sonner";

const FeaturedCourses = () => {
  const [visibleCourses, setVisibleCourses] = useState(3);
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const featuredCourses = courses.filter(course => course.featured);
  const user = getCurrentUser();
  const purchasedCourses = user?.purchasedCourses || [];
  
  const showMoreCourses = () => {
    setVisibleCourses(prev => Math.min(prev + 3, featuredCourses.length));
  };

  const handleQuickBuy = (course: typeof courses[0]) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in or create an account to purchase this course.",
        variant: "default"
      });
      navigate('/signin', { state: { redirectTo: `/course/${course.id}` } });
      return;
    }
    
    setSelectedCourse(course);
    setIsPaymentModalOpen(true);
  };
  
  const handlePaymentComplete = () => {
    if (selectedCourse) {
      import('@/lib/data').then(({ purchaseCourse }) => {
        purchaseCourse(selectedCourse.id);
        
        toast("Payment successful", {
          description: `You've successfully purchased ${selectedCourse.title}`,
        });
        
        // Re-render component to show updated purchase state
        window.dispatchEvent(new Event('storage'));
      });
    }
    
    setIsPaymentModalOpen(false);
    setSelectedCourse(null);
  };
  
  return (
    <section className="py-10">
      {selectedCourse && (
        <PaymentModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          course={selectedCourse}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
      
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Courses</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.slice(0, visibleCourses).map(course => (
            <div key={course.id} className="relative group">
              <CourseCard 
                course={course} 
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
        
        {visibleCourses < featuredCourses.length && (
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
