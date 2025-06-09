import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  RefreshCw,
  Star,
  Check,
  X,
  Loader2,
  MessageSquare,
  BookOpen,
  BookCopy,
  Clock,
  CheckCircle2,
  ChevronDown,
  Filter,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CourseReview, SubjectReview } from '../../../types';
import {
  getCourseReviews,
  getSubjectReviews,
  approveCourseReview,
  approveSubjectReview,
  deleteCourseReview,
  deleteSubjectReview
} from '../../services/reviewService';

interface ReviewsSectionProps { }

const ReviewsSection: React.FC<ReviewsSectionProps> = () => {
  // All state variables with new rating filter
  const [activeTab, setActiveTab] = useState<'courses' | 'subjects'>('courses');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved'>('pending');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [courseReviews, setCourseReviews] = useState<CourseReview[]>([]);
  const [subjectReviews, setSubjectReviews] = useState<SubjectReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processingReviews, setProcessingReviews] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Function to fetch reviews - remains the same
  const fetchReviews = async () => {
    // Existing implementation
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

  // Fetch reviews on component mount - remains the same
  useEffect(() => {
    fetchReviews();
  }, []);

  // All helper functions and handlers remain the same
  const setProcessing = (reviewId: number, type: 'course' | 'subject', isProcessing: boolean) => {
    setProcessingReviews(prev => ({
      ...prev,
      [`${type}-${reviewId}`]: isProcessing
    }));
  };

  const isProcessing = (reviewId: number, type: 'course' | 'subject') => {
    return processingReviews[`${type}-${reviewId}`] === true;
  };

  // All other handler functions remain the same (handleApproveCourseReview, etc.)
  const handleApproveCourseReview = async (id: number) => {
    setProcessing(id, 'course', true);

    try {
      // Immediately update UI to move the review to approved
      const reviewToApprove = courseReviews.find(review => review.id === id);
      if (reviewToApprove) {
        // Remove from current view first if we're in pending tab
        if (statusFilter === 'pending') {
          setCourseReviews(prevReviews =>
            prevReviews.map(review =>
              review.id === id ? { ...review, status: 'approved', is_approved: 1 } : review
            )
          );
        }
      }

      // Call API
      await approveCourseReview(id);

      // Show success toast
      toast({
        title: "Review Approved",
        description: "The course review has been approved successfully.",
        variant: "default"
      });

      // Note: We don't automatically switch to approved tab anymore
    } catch (error) {
      console.error('Error approving course review:', error);

      // Revert the optimistic update
      setCourseReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === id ? { ...review, status: 'pending', is_approved: 0 } : review
        )
      );

      toast({
        title: "Approval Failed",
        description: "Failed to approve the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(id, 'course', false);
    }
  };

  const handleApproveSubjectReview = async (id: number) => {
    setProcessing(id, 'subject', true);

    try {
      // Immediately update UI to move the review to approved
      const reviewToApprove = subjectReviews.find(review => review.id === id);
      if (reviewToApprove) {
        // Remove from current view first if we're in pending tab
        if (statusFilter === 'pending') {
          setSubjectReviews(prevReviews =>
            prevReviews.map(review =>
              review.id === id ? { ...review, status: 'approved', is_approved: 1 } : review
            )
          );
        }
      }

      // Call API
      await approveSubjectReview(id);

      // Show success toast
      toast({
        title: "Review Approved",
        description: "The subject review has been approved successfully.",
        variant: "default"
      });

      // Note: We don't automatically switch to approved tab anymore
    } catch (error) {
      console.error('Error approving subject review:', error);

      // Revert the optimistic update
      setSubjectReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === id ? { ...review, status: 'pending', is_approved: 0 } : review
        )
      );

      toast({
        title: "Approval Failed",
        description: "Failed to approve the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(id, 'subject', false);
    }
  };

  const handleRejectCourseReview = async (id: number) => {
    setProcessing(id, 'course', true);

    try {
      // Immediately remove the review from the UI for better UX
      setCourseReviews(prevReviews =>
        prevReviews.filter(review => review.id !== id)
      );

      // Then call the API
      await deleteCourseReview(id);

      toast({
        title: "Review Rejected",
        description: "The course review has been rejected and removed.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error rejecting course review:', error);

      // On error, fetch reviews to restore any incorrectly removed items
      fetchReviews();

      toast({
        title: "Rejection Failed",
        description: "Failed to reject the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(id, 'course', false);
    }
  };

  const handleRejectSubjectReview = async (id: number) => {
    setProcessing(id, 'subject', true);

    try {
      // Immediately remove the review from the UI for better UX
      setSubjectReviews(prevReviews =>
        prevReviews.filter(review => review.id !== id)
      );

      // Then call the API
      await deleteSubjectReview(id);

      toast({
        title: "Review Rejected",
        description: "The subject review has been rejected and removed.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error rejecting subject review:', error);

      // On error, fetch reviews to restore any incorrectly removed items
      fetchReviews();

      toast({
        title: "Rejection Failed",
        description: "Failed to reject the review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(id, 'subject', false);
    }
  };

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

  // Helper functions remain the same
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const renderStarRating = (rating: number) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
        />
      ))}
    </div>
  );

  // Enhanced filter reviews by status and rating
  const filteredCourseReviews = courseReviews.filter(review => {
    // Status filter
    const statusMatch = statusFilter === 'approved' 
      ? (review.status === 'approved' || review.is_approved === 1 || review.is_approved === true)
      : (review.status === 'pending' || review.is_approved === 0 || review.is_approved === false);
    
    // Rating filter
    const ratingMatch = ratingFilter === 'all' || review.rating === ratingFilter;
    
    return statusMatch && ratingMatch;
  });

  const filteredSubjectReviews = subjectReviews.filter(review => {
    // Status filter
    const statusMatch = statusFilter === 'approved' 
      ? (review.status === 'approved' || review.is_approved === 1 || review.is_approved === true)
      : (review.status === 'pending' || review.is_approved === 0 || review.is_approved === false);
    
    // Rating filter
    const ratingMatch = ratingFilter === 'all' || review.rating === ratingFilter;
    
    return statusMatch && ratingMatch;
  });

  // Enhanced badge counts with rating consideration
  const pendingCourseCount = courseReviews.filter(r => {
    const isPending = r.status === 'pending' || r.is_approved === 0 || r.is_approved === false;
    const ratingMatch = ratingFilter === 'all' || r.rating === ratingFilter;
    return isPending && ratingMatch;
  }).length;

  const pendingSubjectCount = subjectReviews.filter(r => {
    const isPending = r.status === 'pending' || r.is_approved === 0 || r.is_approved === false;
    const ratingMatch = ratingFilter === 'all' || r.rating === ratingFilter;
    return isPending && ratingMatch;
  }).length;

  const approvedCourseCount = courseReviews.filter(r => {
    const isApproved = r.status === 'approved' || r.is_approved === 1 || r.is_approved === true;
    const ratingMatch = ratingFilter === 'all' || r.rating === ratingFilter;
    return isApproved && ratingMatch;
  }).length;

  const approvedSubjectCount = subjectReviews.filter(r => {
    const isApproved = r.status === 'approved' || r.is_approved === 1 || r.is_approved === true;
    const ratingMatch = ratingFilter === 'all' || r.rating === ratingFilter;
    return isApproved && ratingMatch;
  }).length;

  // Helper function to get rating distribution
  const getRatingDistribution = (reviews: (CourseReview | SubjectReview)[]) => {
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[Math.round(review.rating)]++;
      }
    });
    return distribution;
  };

  // Get current reviews for rating distribution
  const currentReviews = activeTab === 'courses' ? courseReviews : subjectReviews;
  const ratingDistribution = getRatingDistribution(currentReviews.filter(review => {
    if (statusFilter === 'approved') {
      return review.status === 'approved' || review.is_approved === 1 || review.is_approved === true;
    } else {
      return review.status === 'pending' || review.is_approved === 0 || review.is_approved === false;
    }
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <Button
          onClick={fetchReviews}
          variant="outline"
          size="sm"
          disabled={loading}
          className="whitespace-nowrap shadow-sm hover:shadow-md transition-shadow"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 text-sm bg-red-50 border border-red-200 rounded-md text-red-800 flex items-center shadow-sm">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="rounded-xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setActiveTab('courses');
                setRatingFilter('all'); // Reset rating filter when switching tabs
              }}
              variant={activeTab === 'courses' ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-lg h-8 px-3",
                activeTab === 'courses' ? "bg-primary text-primary-foreground" : "text-gray-700"
              )}
            >
              Courses {pendingCourseCount > 0 && (
                <Badge variant="secondary" className="ml-1  bg-white/20 -mr-0.5">{pendingCourseCount}</Badge>
              )}
            </Button>
            <Button
              onClick={() => {
                setActiveTab('subjects');
                setRatingFilter('all'); // Reset rating filter when switching tabs
              }}
              variant={activeTab === 'subjects' ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-lg h-8 px-3",
                activeTab === 'subjects' ? "bg-primary text-primary-foreground" : "text-gray-700"
              )}
            >
              Subjects {pendingSubjectCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-white/20 -mr-0.5">{pendingSubjectCount}</Badge>
              )}
            </Button>
          </div>

          {/* Enhanced Filter Controls */}
          <div className="flex items-center gap-2">
            {/* Rating Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 h-8">
                  <Star className="h-3.5 w-3.5" />
                  {ratingFilter === 'all' ? (
                    <span>All Ratings</span>
                  ) : (
                    <div className="flex items-center">
                      <span>{ratingFilter}</span>
                      <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                    </div>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  className={cn(
                    "flex items-center justify-between px-3 py-2 cursor-pointer",
                    ratingFilter === 'all' && "bg-blue-50 text-blue-700"
                  )}
                  onClick={() => setRatingFilter('all')}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-gray-300" />
                      ))}
                    </div>
                    <span>All Ratings</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    {currentReviews.filter(r => statusFilter === 'approved' 
                      ? (r.status === 'approved' || r.is_approved === 1 || r.is_approved === true)
                      : (r.status === 'pending' || r.is_approved === 0 || r.is_approved === false)
                    ).length}
                  </Badge>
                </DropdownMenuItem>
                
                {[5, 4, 3, 2, 1].map((rating) => (
                  <DropdownMenuItem
                    key={rating}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 cursor-pointer",
                      ratingFilter === rating && "bg-yellow-50 text-yellow-700"
                    )}
                    onClick={() => setRatingFilter(rating)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span>{rating} Star{rating !== 1 ? 's' : ''}</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                      {ratingDistribution[rating] || 0}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 h-8">
                  <Filter className="h-3.5 w-3.5" />
                  {statusFilter === 'pending' ? (
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mr-1.5"></div>
                      <span>Pending</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5"></div>
                      <span>Approved</span>
                    </div>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer",
                    statusFilter === 'pending' && "bg-amber-50 text-amber-700"
                  )}
                  onClick={() => setStatusFilter('pending')}
                >
                  <Clock className="h-4 w-4" />
                  <span>Pending</span>
                  <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-600 border-amber-200">
                    {activeTab === 'courses' ? pendingCourseCount : pendingSubjectCount}
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 cursor-pointer",
                    statusFilter === 'approved' && "bg-emerald-50 text-emerald-700"
                  )}
                  onClick={() => setStatusFilter('approved')}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approved</span>
                  <Badge variant="outline" className="ml-auto bg-emerald-50 text-emerald-600 border-emerald-200">
                    {activeTab === 'courses' ? approvedCourseCount : approvedSubjectCount}
                  </Badge>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content Section - Simplified */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        {/* Show active filters if any */}
        {ratingFilter !== 'all' && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Filter className="h-4 w-4" />
                <span>Filtered by:</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                  {ratingFilter} Star{ratingFilter !== 1 ? 's' : ''}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRatingFilter('all')}
                className="text-blue-600 hover:text-blue-700 h-6 px-2"
              >
                Clear filter
              </Button>
            </div>
          </div>
        )}

        {/* Reviews Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-primary/70 animate-spin mb-3" />
            <span className="text-gray-600 font-medium">Loading reviews...</span>
          </div>
        ) : activeTab === 'courses' && filteredCourseReviews.length > 0 ? (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-[180px]">Student</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="text-right w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourseReviews.map((review) => (
                  <TableRow key={review.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium shadow-sm">
                          {review.student_name ? review.student_name.substring(0, 2).toUpperCase() : 'AN'}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{review.student_name || 'Anonymous'}</div>
                          <div className="flex items-center">
                            {renderStarRating(review.rating)}
                            <span className="ml-1 text-xs text-gray-500">{review.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium mb-1 flex items-center">
                          <div className="mr-2 h-5 w-5 rounded bg-blue-100 flex items-center justify-center">
                            <BookOpen className="h-3 w-3 text-blue-700" />
                          </div>
                          {review.course_name || `Course #${review.course_id}`}
                        </div>
                        {review.content ? (
                          <div className="text-sm text-gray-600 leading-snug bg-gray-50 p-2 rounded-md border border-gray-100">
                            "{review.content}"
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic bg-gray-50 p-2 rounded-md border border-gray-100 flex items-center">
                            <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            No review content provided
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700 font-medium">
                        {formatDate(review.created_at)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {statusFilter === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveCourseReview(review.id)}
                              disabled={isProcessing(review.id, 'course')}
                              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 h-8 transition-colors shadow-sm"
                            >
                              {isProcessing(review.id, 'course') ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-3.5 w-3.5 mr-1.5" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectCourseReview(review.id)}
                              disabled={isProcessing(review.id, 'course')}
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-8 transition-colors shadow-sm"
                            >
                              {isProcessing(review.id, 'course') ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <X className="h-3.5 w-3.5 mr-1.5" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCourseReview(review.id)}
                            disabled={isProcessing(review.id, 'course')}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-8 transition-colors shadow-sm"
                          >
                            {isProcessing(review.id, 'course') ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <X className="h-3.5 w-3.5 mr-1.5" />
                                Delete
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : activeTab === 'subjects' && filteredSubjectReviews.length > 0 ? (
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-[180px]">Student</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="text-right w-[180px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjectReviews.map((review) => (
                  <TableRow key={review.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-medium shadow-sm">
                          {review.student_name ? review.student_name.substring(0, 2).toUpperCase() : 'AN'}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{review.student_name || 'Anonymous'}</div>
                          <div className="flex items-center">
                            {renderStarRating(review.rating)}
                            <span className="ml-1 text-xs text-gray-500">{review.rating}/5</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium mb-1 flex items-center">
                          <div className="mr-2 h-5 w-5 rounded bg-purple-100 flex items-center justify-center">
                            <BookCopy className="h-3 w-3 text-purple-700" />
                          </div>
                          {review.subject_name || `Subject #${review.subject_id}`}
                        </div>
                        {review.content ? (
                          <div className="text-sm text-gray-600 leading-snug bg-gray-50 p-2 rounded-md border border-gray-100">
                            "{review.content}"
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic bg-gray-50 p-2 rounded-md border border-gray-100 flex items-center">
                            <AlertCircle className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            No review content provided
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-700 font-medium">
                        {formatDate(review.created_at)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(review.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {statusFilter === 'pending' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveSubjectReview(review.id)}
                              disabled={isProcessing(review.id, 'subject')}
                              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 h-8 transition-colors shadow-sm"
                            >
                              {isProcessing(review.id, 'subject') ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <Check className="h-3.5 w-3.5 mr-1.5" />
                                  Approve
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectSubjectReview(review.id)}
                              disabled={isProcessing(review.id, 'subject')}
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-8 transition-colors shadow-sm"
                            >
                              {isProcessing(review.id, 'subject') ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <X className="h-3.5 w-3.5 mr-1.5" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSubjectReview(review.id)}
                            disabled={isProcessing(review.id, 'subject')}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-8 transition-colors shadow-sm"
                          >
                            {isProcessing(review.id, 'subject') ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <X className="h-3.5 w-3.5 mr-1.5" />
                                Delete
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white p-5 max-w-sm mx-auto rounded-lg shadow-sm border">
              <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-700 mb-1.5">
                No {statusFilter} reviews{ratingFilter !== 'all' ? ` with ${ratingFilter} star${ratingFilter !== 1 ? 's' : ''}` : ''}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {ratingFilter !== 'all' 
                  ? `No ${activeTab === 'courses' ? 'course' : 'subject'} reviews found with ${ratingFilter} star rating${ratingFilter !== 1 ? 's' : ''}.`
                  : statusFilter === 'pending'
                  ? `There are no ${activeTab === 'courses' ? 'course' : 'subject'} reviews waiting for approval.`
                  : `There are no approved ${activeTab === 'courses' ? 'course' : 'subject'} reviews at the moment.`}
              </p>
              <div className="flex gap-2 justify-center">
                {ratingFilter !== 'all' && (
                  <Button variant="outline" size="sm" onClick={() => setRatingFilter('all')}>
                    Clear filter
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={fetchReviews}>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;