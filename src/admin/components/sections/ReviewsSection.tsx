import React from 'react';
import ReviewTabs from '../reviews/ReviewTabs';
import { Review } from '../../types';

interface ReviewsSectionProps {
  reviews: Review[];
  onApproveReview: (id: number) => void;
  onRejectReview: (id: number) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onApproveReview,
  onRejectReview
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Review Management</h1>
      </div>
      
      <ReviewTabs 
        reviews={reviews}
        onApprove={onApproveReview}
        onReject={onRejectReview}
      />
    </div>
  );
};

export default ReviewsSection;