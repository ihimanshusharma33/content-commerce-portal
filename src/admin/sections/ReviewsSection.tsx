import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseReview, SubjectReview } from '../../../types';
import { 
  getCourseReviews, 
  getSubjectReviews, 
  approveCourseReview, 
  approveSubjectReview, 
  deleteCourseReview, 
  deleteSubjectReview 
} from '../../services/reviewService';
import { RefreshCw, Star, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

interface ReviewsSectionProps { }

const ReviewsSection: React.FC<ReviewsSectionProps> = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'subjects'>('courses');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved'>('pending');
  const [courseReviews, setCourseReviews] = useState<CourseReview[]>([]);
  const [subjectReviews, setSubjectReviews] = useState<SubjectReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingReviews, setProcessingReviews] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Function to fetch reviews
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch course reviews
      let courseData: CourseReview[] = [];
      try {
        courseData = await getCourseReviews();
        console.log('Fetched course reviews:', courseData);
      } catch (error) {
        console.error('Error fetching course reviews:', error);
        toast({
          title: "Error",
          description: "Failed to load course reviews. Please try again.",
          variant: "destructive"
        });
      }
      
      // Fetch subject reviews
      let subjectData: SubjectReview[] = [];
      try {
        subjectData = await getSubjectReviews();
        console.log('Fetched subject reviews:', subjectData);
      } catch (error) {
        console.error('Error fetching subject reviews:', error);
        toast({
          title: "Error",
          description: "Failed to load subject reviews. Please try again.",
          variant: "destructive"
        });
      }
      
      setCourseReviews(courseData);
      setSubjectReviews(subjectData);
    } catch (error) {
      console.error('Error in fetchReviews:', error);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch both types of reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, []);

  // Helper to set processing state for a review
  const setProcessing = (reviewId: number, type: 'course' | 'subject', isProcessing: boolean) => {
    setProcessingReviews(prev => ({
      ...prev,
      [`${type}-${reviewId}`]: isProcessing
    }));
  };

  // Check if a review is currently being processed
  const isProcessing = (reviewId: number, type: 'course' | 'subject') => {
    return processingReviews[`${type}-${reviewId}`] === true;
  };

  // Handle course review approval
  const handleApproveCourseReview = async (id: number) => {
    setProcessing(id, 'course', true);
    
    try {
      await approveCourseReview(id);
      
      // Update the local state immediately
      setCourseReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === id ? { ...review, status: 'approved' } : review
        )
      );
      
      // Show success toast
      toast({
        title: "Review Approved",
        description: "The course review has been approved successfully.",
        variant: "default"
      });
      
      // Automatically switch to approved tab if we're approving from the pending tab
      if (statusFilter === 'pending') {
        setTimeout(() => {
          setStatusFilter('approved');
        }, 300);
      }
    } catch (error) {
      console.error('Error approving course review:', error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(id, 'course', false);
    }
  };

  // Handle subject review approval
  const handleApproveSubjectReview = async (id: number) => {
    setProcessing(id, 'subject', true);
    
    try {
      await approveSubjectReview(id);
      
      // Update the local state immediately
      setSubjectReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === id ? { ...review, status: 'approved' } : review
        )
      );
      
      // Show success toast
      toast({
        title: "Review Approved",
        description: "The subject review has been approved successfully.",
        variant: "default"
      });
      
      // Automatically switch to approved tab if we're approving from the pending tab
      if (statusFilter === 'pending') {
        setTimeout(() => {
          setStatusFilter('approved');
        }, 300);
      }
    } catch (error) {
      console.error('Error approving subject review:', error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(id, 'subject', false);
    }
  };

  // Handle course review rejection (deletion from database)
  const handleRejectCourseReview = async (id: number) => {
    setProcessing(id, 'course', true);
    
    try {
      await deleteCourseReview(id);
      
      // Update the local state by removing the review
      setCourseReviews(prevReviews => 
        prevReviews.filter(review => review.id !== id)
      );
      
      toast({
        title: "Review Rejected",
        description: "The course review has been rejected and removed.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error rejecting course review:', error);
      toast({
        title: "Rejection Failed",
        description: "Failed to reject the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(id, 'course', false);
    }
  };

  // Handle subject review rejection (deletion from database)
  const handleRejectSubjectReview = async (id: number) => {
    setProcessing(id, 'subject', true);
    
    try {
      await deleteSubjectReview(id);
      
      // Update the local state by removing the review
      setSubjectReviews(prevReviews => 
        prevReviews.filter(review => review.id !== id)
      );
      
      toast({
        title: "Review Rejected",
        description: "The subject review has been rejected and removed.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error rejecting subject review:', error);
      toast({
        title: "Rejection Failed",
        description: "Failed to reject the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(id, 'subject', false);
    }
  };

  // Handle deletion of an approved course review
  const handleDeleteCourseReview = async (id: number) => {
    setProcessing(id, 'course', true);
    
    try {
      await deleteCourseReview(id);
      
      // Update the local state by removing the review
      setCourseReviews(prevReviews => 
        prevReviews.filter(review => review.id !== id)
      );
      
      toast({
        title: "Review Deleted",
        description: "The course review has been deleted successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting course review:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(id, 'course', false);
    }
  };

  // Handle deletion of an approved subject review
  const handleDeleteSubjectReview = async (id: number) => {
    setProcessing(id, 'subject', true);
    
    try {
      await deleteSubjectReview(id);
      
      // Update the local state by removing the review
      setSubjectReviews(prevReviews => 
        prevReviews.filter(review => review.id !== id)
      );
      
      toast({
        title: "Review Deleted",
        description: "The subject review has been deleted successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting subject review:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(id, 'subject', false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

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

  // Filter reviews by status and is_approved
  const filteredCourseReviews = courseReviews.filter(review => {
    if (statusFilter === 'approved') {
      return review.status === 'approved' || review.is_approved === 1 || review.is_approved === true;
    } else {
      return review.status === 'pending' || review.is_approved === 0 || review.is_approved === false;
    }
  });
  
  const filteredSubjectReviews = subjectReviews.filter(review => {
    if (statusFilter === 'approved') {
      return review.status === 'approved' || review.is_approved === 1 || review.is_approved === true;
    } else {
      return review.status === 'pending' || review.is_approved === 0 || review.is_approved === false;
    }
  });

  // Check if we need to show loading states
  const showInitialLoading = loading && (courseReviews.length === 0 || subjectReviews.length === 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reviews Management</h1>
        <Button onClick={fetchReviews} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        {/* Type tabs (courses/subjects) */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'courses' | 'subjects')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">Course Reviews</TabsTrigger>
            <TabsTrigger value="subjects">Subject Reviews</TabsTrigger>
          </TabsList>
          
          {/* Status tabs (pending/approved) */}
          <div className="mt-4">
            <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'pending' | 'approved')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <TabsContent value="courses" className="mt-4">
            {showInitialLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">Loading course reviews...</span>
              </div>
            ) : filteredCourseReviews.length > 0 ? (
              <div className="space-y-4">
                {filteredCourseReviews.map((review) => (
                  <div key={review.id} className="border p-4 rounded-md shadow-md">
                    <div className='flex justify-between'>
                      <p className="text-md font-semibold">Course: {review.course_name || `Course #${review.course_id}`}</p>
                      <p className="text-md font-semibold">Student: {review.student_name || 'Anonymous'}</p>
                    </div>
                    <div className='text-md'>
                      <p className="text-gray-800 my-4"><strong className='text-semibold'>Review:</strong> {review.content}</p>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-800 mr-2"><strong className='text-semibold'>Rating:</strong></span>
                      {renderStarRating(review.rating)}
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-800 mr-2"><strong className='text-semibold'>Date:</strong></span>
                      {formatDate(review.created_at)}
                    </div>
                    <div className="flex justify-start gap-2 mt-2">
                      {statusFilter === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleApproveCourseReview(review.id)}
                            disabled={isProcessing(review.id, 'course')}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            {isProcessing(review.id, 'course') ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleRejectCourseReview(review.id)}
                            disabled={isProcessing(review.id, 'course')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            {isProcessing(review.id, 'course') ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <X className="h-3 w-3 mr-1" />
                                Reject
                              </>
                            )}
                          </Button>
                        </>
                      )}
                      {statusFilter === 'approved' && (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteCourseReview(review.id)}
                          disabled={isProcessing(review.id, 'course')}
                        >
                          {isProcessing(review.id, 'course') ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-10 text-center">No {statusFilter} course reviews available.</p>
            )}
          </TabsContent>
          
          <TabsContent value="subjects" className="mt-4">
            {showInitialLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">Loading subject reviews...</span>
              </div>
            ) : filteredSubjectReviews.length > 0 ? (
              <div className="space-y-4">
                {filteredSubjectReviews.map((review) => (
                  <div key={review.id} className="border p-4 rounded-md shadow-md">
                    <div className='flex justify-between'>
                      <p className="text-md font-semibold">Subject: {review.subject_name || `Subject #${review.subject_id}`}</p>
                      <p className="text-md font-semibold">Student: {review.student_name || 'Anonymous'}</p>
                    </div>
                    <div className='text-md'>
                      <p className="text-gray-800 my-4"><strong className='text-semibold'>Review:</strong> {review.content}</p>
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-800 mr-2"><strong className='text-semibold'>Rating:</strong></span>
                      {renderStarRating(review.rating)}
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-800 mr-2"><strong className='text-semibold'>Date:</strong></span>
                      {formatDate(review.created_at)}
                    </div>
                    <div className="flex justify-start gap-2 mt-2">
                      {statusFilter === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleApproveSubjectReview(review.id)}
                            disabled={isProcessing(review.id, 'subject')}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            {isProcessing(review.id, 'subject') ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleRejectSubjectReview(review.id)}
                            disabled={isProcessing(review.id, 'subject')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            {isProcessing(review.id, 'subject') ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <X className="h-3 w-3 mr-1" />
                                Reject
                              </>
                            )}
                          </Button>
                        </>
                      )}
                      {statusFilter === 'approved' && (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteSubjectReview(review.id)}
                          disabled={isProcessing(review.id, 'subject')}
                        >
                          {isProcessing(review.id, 'subject') ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-10 text-center">No {statusFilter} subject reviews available.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewsSection;