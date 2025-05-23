import React from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '@/components/CourseCard';
import { isAuthenticated, getCurrentUser, courses as userCourse } from '@/lib/data';

interface MyCoursesProps {
  courses: any[]; // Replace with your actual course type
}

const MyCourses: React.FC<MyCoursesProps> = ({ courses }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  console.log(user);
  const purchasedCourses = userCourse.filter(course => 
    user?.purchasedCourses.includes(course.id)
  );

  return (
    <>
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
        <div className="text-center py-8 sm:py-12">
          <h3 className="text-lg sm:text-xl font-medium mb-2">You haven't purchased any courses yet</h3>
          <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
            Browse our catalog and find the perfect course to start your learning journey
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="btn-primary text-sm px-3 py-1.5 sm:text-base sm:px-4 sm:py-2"
          >
            Browse Courses
          </button>
        </div>
      )}
    </>
  );
};

export default MyCourses;