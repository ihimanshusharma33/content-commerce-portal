import { useEffect, useState } from 'react';
import { getStudentReviews } from '@/services/studentService';
import { Star, Clock, CheckCircle, AlertCircle, BookOpen, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

const StudentReviews = () => {
  const [courseReviews, setCourseReviews] = useState<any[]>([]);
  const [subjectReviews, setSubjectReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
interface StudentReviewsProps {
  reviews: Review[];
}

const StudentReviews = ({ reviews }: StudentReviewsProps) => {
  const navigate = useNavigate();

  
  
  return (
    <>
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">My Course Reviews</h2>
=======
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getStudentReviews();
>>>>>>> c1199260da327c686b11bbf9d425841940d41811
        
        if (response.data) {
          setCourseReviews(response.data.course_reviews || []);
          setSubjectReviews(response.data.subject_reviews || []);
        } else {
          setCourseReviews(response.course_reviews || []);
          setSubjectReviews(response.subject_reviews || []);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Combine and sort all reviews by creation date
  const allReviews = [
    ...courseReviews.map(review => ({ ...review, type: 'course' as const })),
    ...subjectReviews.map(review => ({ ...review, type: 'subject' as const }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`h-3 w-3 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
        />
      ))}
      <span className="ml-1 text-xs text-gray-600">({rating})</span>
    </div>
  );

  const getApprovalStatusBadge = (isApproved: number | boolean) => {
    const approved = isApproved === 1 || isApproved === true;
    if (approved) {
      return (
        <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded text-xs">
          <CheckCircle className="h-3 w-3" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs">
          <AlertCircle className="h-3 w-3" />
          Pending
        </span>
      );
    }
  };

  const ReviewCard = ({ review }: { review: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
      <div className="flex items-start gap-2 mb-2">
        <div className={`p-1.5 rounded ${review.type === 'course' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
          {review.type === 'course' ? <BookOpen className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              review.type === 'course' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {review.type === 'course' ? 'Course' : 'Subject'}
            </span>
            {getApprovalStatusBadge(review.is_approved)}
          </div>
          <h3 className="font-medium text-sm text-gray-900 truncate">
            {review.type === 'course' 
              ? review.course?.course_name || `Course #${review.course_id}` 
              : review.subject?.subject_name || `Subject #${review.subject_id}`
            }
          </h3>
          <div className="mt-1">
            {renderStars(review.rating)}
          </div>
        </div>
      </div>

      <p className="text-gray-700 text-xs leading-relaxed mb-2">
        {review.review_description || 'No review description provided.'}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {format(new Date(review.created_at), 'MMM d, yyyy')}
        </div>
        {((review.type === 'course' && review.course?.price) || (review.type === 'subject' && review.subject?.price)) && (
          <span className="font-medium text-gray-700">
            ₹{review.type === 'course' ? review.course.price : review.subject.price}
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm text-gray-600">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Minimal Header */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">My Reviews</h2>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-xs text-gray-600">{courseReviews.length} Courses</span>
          <span className="text-xs text-gray-600">{subjectReviews.length} Subjects</span>
        </div>
      </div>

      {/* Scrollable Reviews Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {allReviews.length > 0 ? (
          <div>
            {allReviews.map((review) => (
              <ReviewCard key={`${review.type}-${review.review_id}`} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No reviews yet</h3>
            <p className="text-xs text-gray-600">Start reviewing your courses and subjects</p>
          </div>
        )}
      </div>

      {/* Minimal Footer Info */}
      <div className="flex-shrink-0 px-3 py-2 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600">
          Reviews are subject to approval before being displayed publicly.
        </p>
      </div>
    </div>
  );
};

export default StudentReviews;