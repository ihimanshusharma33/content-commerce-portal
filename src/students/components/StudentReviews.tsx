import { useEffect, useState } from 'react';
import { getStudentReviews } from '@/services/studentService';
import { Star, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const StudentReviews = () => {
  const [courseReviews, setCourseReviews] = useState<any[]>([]);
  const [subjectReviews, setSubjectReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getStudentReviews();
        setCourseReviews(data.course_reviews || []);
        setSubjectReviews(data.subject_reviews || []);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`h-3 w-3 sm:h-4 sm:w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">My Course Reviews</h2>
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : courseReviews.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {courseReviews.map((review) => (
              <div key={review.review_id} className="border rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                  <h3 className="font-medium text-sm sm:text-base">{review.course?.course_name || 'Course'}</h3>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3 sm:line-clamp-none">{review.review_description}</p>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Posted on {format(new Date(review.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Star className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No course reviews yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              You haven't submitted any course reviews yet
            </p>
            <button 
              onClick={() => navigate('/courses')}
              className="btn-secondary text-sm px-3 py-1.5 sm:text-base sm:px-4 sm:py-2"
            >
              Browse Your Courses
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">My Subject Reviews</h2>
        {loading ? (
          <div className="text-center py-6">Loading...</div>
        ) : subjectReviews.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {subjectReviews.map((review) => (
              <div key={review.review_id} className="border rounded-lg p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                  <h3 className="font-medium text-sm sm:text-base">{review.subject?.subject_name || 'Subject'}</h3>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3 sm:line-clamp-none">{review.review_description}</p>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Posted on {format(new Date(review.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <Star className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium mb-2">No subject reviews yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              You haven't submitted any subject reviews yet
            </p>
            <button 
              onClick={() => navigate('/courses')}
              className="btn-secondary text-sm px-3 py-1.5 sm:text-base sm:px-4 sm:py-2"
            >
              Browse Your Courses
            </button>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 bg-primary/10 rounded-lg">
        <p className="text-xs sm:text-sm">
          <strong>Note:</strong> Your reviews help other students make informed decisions. 
          Please be honest and constructive in your feedback.
        </p>
      </div>
    </>
  );
};

export default StudentReviews;