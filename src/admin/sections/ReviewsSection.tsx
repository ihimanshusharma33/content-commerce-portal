import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { fetchPendingReviews, approveReview, rejectReview } from '../../services/apiService';
import { Review } from '../../services/apiService';

interface ReviewsSectionProps { }

const ReviewsSection: React.FC<ReviewsSectionProps> = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all pending reviews on component mount
  useEffect(() => {
    setLoading(true);
    fetchPendingReviews()
      .then((data) => setReviews(data))
      .catch((error) => console.error('Failed to fetch reviews:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleApproveReview = (id: number) => {
    approveReview(id)
      .then(() => {
        setReviews((prev) => prev.filter((review) => review.id !== id)); // Remove approved review from the list
      })
      .catch((error) => console.error('Failed to approve review:', error));
  };

  const handleRejectReview = (id: number) => {
    rejectReview(id)
      .then(() => {
        setReviews((prev) => prev.filter((review) => review.id !== id)); // Remove rejected review from the list
      })
      .catch((error) => console.error('Failed to reject review:', error));
  };

  // Render stars for the rating
  const renderStars = (rating: number) => {
    const totalStars = 5;
    const yellowStars = Array(rating).fill('text-yellow-500');
    const grayStars = Array(totalStars - rating).fill('text-gray-300');
    const stars = [...yellowStars, ...grayStars];

    return (
      <div className="flex">
        {stars.map((color, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className={`w-5 h-5 ${color}`}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Pending Reviews</h1>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border p-4 rounded-md shadow-md">
              <div className='flex justify-between'>
                <p className="text-md font-semibold">Course ID: {review.courseId}</p>
                <p className="text-md font-semibold">User ID: {review.userId}</p>
              </div>
              <div className='text-md'>
                <p className=" text-gray-800 my-4"><strong className='text-semibold'>Review:</strong> {review.content}</p>
              </div>
              <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-800 mr-2"><strong className='text-semibold'>Rating:</strong></span>
                  {renderStars(review.rating)}
                </div>
              <div className="flex justify-start gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => handleApproveReview(review.id)}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleRejectReview(review.id)}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No pending reviews available.</p>
      )}
    </div>
  );
};

export default ReviewsSection;