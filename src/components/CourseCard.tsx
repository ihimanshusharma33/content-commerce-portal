
import { Link } from 'react-router-dom';
import { Course } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { getAssetUrl } from '@/services/apiService';

interface CourseCardProps {
  course: Course;
  isPurchased?: boolean;
  course_or_subject: string;
  isExpired?: boolean;
  expiryDaysLeft?: number | null;
}

const CourseCard = ({ course, isPurchased = false, course_or_subject, isExpired=false, expiryDaysLeft=null}: CourseCardProps) => {
  return (
    <Link to={`/${course_or_subject}/${course.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden border shadow-sm card-hover h-full">
        <div className="relative">
        
           <img
            src={getAssetUrl(course.image)}                  
            alt={course.title}
            className="w-full h-48 object-cover"
                            />

          {/* Labels */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          
            {course.bestseller && (
              <Badge className="bg-accent text-white">Bestseller</Badge>
            )}
            {isPurchased && (
              <Badge className="bg-green-500 text-white">Purchased</Badge>
            )}
              {isExpired ? (
              <Badge className="bg-red-500 text-white">Expired</Badge>
            ) : (
              expiryDaysLeft !== null && (
                <Badge className="bg-yellow-500 text-white">Expires in {expiryDaysLeft} days</Badge>
              )
            )}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold leading-tight mb-1 line-clamp-2">{course.title}</h3>
          {course_or_subject === "course" && (
            <p className="text-sm text-muted-foreground mb-2">
              Semester: {course?.semester}
            </p>
          )}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <span className="text-amber-500 font-semibold">{Number(course.rating).toFixed(1)}</span>
              <div className="flex ml-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(course.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-xs text-gray-500">({course.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                {course_or_subject && (
                  course_or_subject.charAt(0).toUpperCase() + course_or_subject.slice(1)
                )}
              </span>
            </div>

            <div>
              {course.discountPrice ? (
                <div className="text-right">
                  <span className="font-bold">${course.discountPrice}</span>
                  <span className="text-gray-400 line-through text-sm ml-1">{Number(course.price).toFixed(1)}</span>
                </div>
              ) : (
                <span className="font-bold">${Number(course.price).toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
