import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getApprovedCourseReviews, getReviewsByCourseId, getApprovedSubjectReviews, getReviewsBySubjectId } from '@/services/reviewService';
import { CourseReview, SubjectReview } from '../../types';
import { format } from 'date-fns';

interface ReviewListProps {
  type: 'course' | 'subject';
  itemId: number;
  showOnlyApproved?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ type, itemId, showOnlyApproved = true }) => {
  const [reviews, setReviews] = useState<(CourseReview | SubjectReview)[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let fetchedReviews;
        
        if (type === 'course') {
          if (showOnlyApproved) {
            fetchedReviews = await getApprovedCourseReviews();
            // Filter for only this course
            fetchedReviews = fetchedReviews.filter(review => 
              (review as CourseReview).course_id === itemId
            );
          } else {
            fetchedReviews = await getReviewsByCourseId(itemId);
          }
        } else {
          if (showOnlyApproved) {
            fetchedReviews = await getApprovedSubjectReviews();
            // Filter for only this subject
            fetchedReviews = fetchedReviews.filter(review => 
              (review as SubjectReview).subject_id === itemId
            );
          } else {
            fetchedReviews = await getReviewsBySubjectId(itemId);
          }
        }
        
        setReviews(fetchedReviews);
        
        // Calculate average rating
        if (fetchedReviews.length > 0) {
          const totalRating = fetchedReviews.reduce((sum, review) => sum + review.rating, 0);
          setAverageRating(totalRating / fetchedReviews.length);
        }
      } catch (error) {
        console.error(`Error fetching ${type} reviews:`, error);
        setError(`Failed to load reviews. Please try again.`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, [type, itemId, showOnlyApproved]);
  
  // Render star rating
  const renderStarRating = (rating: number) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reviews</span>
          {reviews.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="text-sm font-normal">
                Average Rating: {averageRating.toFixed(1)}
              </div>
              {renderStarRating(averageRating)}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{review.student_name || 'Anonymous Student'}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(review.created_at)}
                  </div>
                </div>
                <div className="mb-2">
                  {renderStarRating(review.rating)}
                </div>
                <p className="text-sm">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No reviews available for this {type} yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewList;