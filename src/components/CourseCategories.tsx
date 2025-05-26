
import { Link } from 'react-router-dom';
import { categories } from '@/lib/data';
import { useEffect, useState } from 'react';
import { fetchCourses } from '@/services/apiService';
import { Course } from 'types';

const CourseCategories = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then((data) => setCourses(data))
      .catch((error) => console.error('Failed to fetch courses:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-10 bg-secondary/30">
      <div className="container-custom">
        <h2 className="text-3xl font-bold mb-8 text-center animate-bounce.
        ">Browse Categories</h2>
        
       {loading?(<>
       Loading...
       </>):(<>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {courses.map(category => (
            <Link 
              to={`/courses?category=${category.id}`}
              key={category.id}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-full bg-secondary/30 flex items-center justify-center mb-3">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="font-medium text-center">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.totalSemesters} courses</p>
            </Link>
          ))}
        </div>
       </>)}
      </div>
    </section>
  );
};

export default CourseCategories;
