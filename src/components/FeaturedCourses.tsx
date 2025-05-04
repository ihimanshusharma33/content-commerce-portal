
import { useState } from "react";
import CourseCard from '@/components/CourseCard';
import { courses } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/data";

const FeaturedCourses = () => {
  const [visibleCourses, setVisibleCourses] = useState(3);
  const featuredCourses = courses.filter(course => course.featured);
  const user = getCurrentUser();
  const purchasedCourses = user?.purchasedCourses || [];
  
  const showMoreCourses = () => {
    setVisibleCourses(prev => Math.min(prev + 3, featuredCourses.length));
  };
  
  return (
    <section className="py-10">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Courses</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.slice(0, visibleCourses).map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              isPurchased={purchasedCourses.includes(course.id)}
            />
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
