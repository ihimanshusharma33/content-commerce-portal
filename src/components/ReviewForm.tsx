import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { createCourseReview, createSubjectReview } from '@/services/reviewService';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewFormProps {
  type: 'course' | 'subject';
  itemId: number;
  itemName: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ type, itemId, itemName, onReviewSubmitted }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a review",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive"
      });
      return;
    }

    if (content.trim().length < 10) {
      toast({
        title: "Review too short",
        description: "Please provide a more detailed review (at least 10 characters)",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (type === 'course') {
        await createCourseReview(itemId, rating, content);
      } else {
        await createSubjectReview(itemId, rating, content);
      }

      toast({
        title: "Review submitted",
        description: `Your review for this ${type} has been submitted for approval`,
      });

      // Reset form
      setRating(0);
      setContent('');

      // Callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error(`Error submitting ${type} review:`, error);
      toast({
        title: "Submission failed",
        description: `There was a problem submitting your review. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
        <CardDescription>
          Share your experience with this {type}: {itemName}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    (hoverRating || rating) >= star 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  } transition-colors duration-150`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
              <span className="ml-2 text-sm">
                {rating ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Select a rating'}
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="reviewContent" className="block text-sm font-medium mb-2">
              Your Review
            </label>
            <Textarea
              id="reviewContent"
              placeholder={`Tell others what you think about this ${type}...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewForm;