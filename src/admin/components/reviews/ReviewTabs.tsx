import React, { useState, useEffect } from 'react';
import { Check, X, Star, RefreshCw } from "lucide-react";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseReview, SubjectReview } from "../../../../types";
import { 
  getCourseReviews, 
  getSubjectReviews, 
  approveCourseReview, 
  approveSubjectReview, 
  deleteCourseReview, 
  deleteSubjectReview 
} from "../../../services/reviewService";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';

const ReviewTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'subjects'>('courses');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [courseReviews, setCourseReviews] = useState<CourseReview[]>([]);
  const [subjectReviews, setSubjectReviews] = useState<SubjectReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  // Handle course review approval
  const handleApproveCourseReview = async (id: number) => {
    try {
      await approveCourseReview(id);
      
      // Update the local state
      setCourseReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === id ? { ...review, status: 'approved' } : review
        )
      );
      
      toast({
        title: "Success",
        description: "Course review approved successfully",
      });
    } catch (error) {
      console.error('Error approving course review:', error);
      toast({
        title: "Error",
        description: "Failed to approve review. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle subject review approval
  const handleApproveSubjectReview = async (id: number) => {
    try {
      await approveSubjectReview(id);
      
      // Update the local state
      setSubjectReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === id ? { ...review, status: 'approved' } : review
        )
      );
      
      toast({
        title: "Success",
        description: "Subject review approved successfully",
      });
    } catch (error) {
      console.error('Error approving subject review:', error);
      toast({
        title: "Error",
        description: "Failed to approve review. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle course review deletion
  const handleDeleteCourseReview = async (id: number) => {
    try {
      await deleteCourseReview(id);
      
      // Update the local state
      setCourseReviews(prevReviews => 
        prevReviews.filter(review => review.id !== id)
      );
      
      toast({
        title: "Success",
        description: "Course review deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting course review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle subject review deletion
  const handleDeleteSubjectReview = async (id: number) => {
    try {
      await deleteSubjectReview(id);
      
      // Update the local state
      setSubjectReviews(prevReviews => 
        prevReviews.filter(review => review.id !== id)
      );
      
      toast({
        title: "Success",
        description: "Subject review deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting subject review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle rejecting a review (sets status to rejected)
  const handleRejectCourseReview = async (id: number) => {
    try {
      // Update the local state first (optimistic update)
      setCourseReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === id ? { ...review, status: 'rejected' } : review
        )
      );
      
      // You might implement a proper API call for rejecting reviews
      toast({
        title: "Success",
        description: "Course review rejected",
      });
    } catch (error) {
      console.error('Error rejecting course review:', error);
      toast({
        title: "Error",
        description: "Failed to reject review. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle rejecting a subject review
  const handleRejectSubjectReview = async (id: number) => {
    try {
      // Update the local state first (optimistic update)
      setSubjectReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === id ? { ...review, status: 'rejected' } : review
        )
      );
      
      // You might implement a proper API call for rejecting reviews
      toast({
        title: "Success",
        description: "Subject review rejected",
      });
    } catch (error) {
      console.error('Error rejecting subject review:', error);
      toast({
        title: "Error",
        description: "Failed to reject review. Please try again.",
        variant: "destructive"
      });
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

  // Filter reviews by status
  const filteredCourseReviews = courseReviews.filter(review => review.status === statusFilter);
  const filteredSubjectReviews = subjectReviews.filter(review => review.status === statusFilter);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reviews Management</h2>
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
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'courses' | 'subjects')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">Course Reviews</TabsTrigger>
            <TabsTrigger value="subjects">Subject Reviews</TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsList>
              <TabsTrigger 
                value="pending" 
                onClick={() => setStatusFilter('pending')}
                data-active={statusFilter === 'pending'}
                className={statusFilter === 'pending' ? 'bg-primary text-primary-foreground' : ''}
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="approved" 
                onClick={() => setStatusFilter('approved')}
                data-active={statusFilter === 'approved'}
                className={statusFilter === 'approved' ? 'bg-primary text-primary-foreground' : ''}
              >
                Approved
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                onClick={() => setStatusFilter('rejected')}
                data-active={statusFilter === 'rejected'}
                className={statusFilter === 'rejected' ? 'bg-primary text-primary-foreground' : ''}
              >
                Rejected
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="courses" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Course</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review Content</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading reviews...
                        </TableCell>
                      </TableRow>
                    ) : filteredCourseReviews.length > 0 ? (
                      filteredCourseReviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">{review.course_name || `Course #${review.course_id}`}</TableCell>
                          <TableCell>{review.student_name || 'Anonymous'}</TableCell>
                          <TableCell>{renderStarRating(review.rating)}</TableCell>
                          <TableCell className="max-w-xs truncate">{review.content}</TableCell>
                          <TableCell>{formatDate(review.created_at)}</TableCell>
                          <TableCell className="text-right">
                            {statusFilter === 'pending' && (
                              <div className="flex justify-end space-x-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleApproveCourseReview(review.id)}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleRejectCourseReview(review.id)}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {statusFilter === 'approved' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600"
                                onClick={() => handleDeleteCourseReview(review.id)}
                              >
                                Remove
                              </Button>
                            )}
                            {statusFilter === 'rejected' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApproveCourseReview(review.id)}
                              >
                                Reconsider
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No {statusFilter} course reviews found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subjects" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Subject</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review Content</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading reviews...
                        </TableCell>
                      </TableRow>
                    ) : filteredSubjectReviews.length > 0 ? (
                      filteredSubjectReviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">{review.subject_name || `Subject #${review.subject_id}`}</TableCell>
                          <TableCell>{review.student_name || 'Anonymous'}</TableCell>
                          <TableCell>{renderStarRating(review.rating)}</TableCell>
                          <TableCell className="max-w-xs truncate">{review.content}</TableCell>
                          <TableCell>{formatDate(review.created_at)}</TableCell>
                          <TableCell className="text-right">
                            {statusFilter === 'pending' && (
                              <div className="flex justify-end space-x-1">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => handleApproveSubjectReview(review.id)}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                  onClick={() => handleRejectSubjectReview(review.id)}
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {statusFilter === 'approved' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600"
                                onClick={() => handleDeleteSubjectReview(review.id)}
                              >
                                Remove
                              </Button>
                            )}
                            {statusFilter === 'rejected' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleApproveSubjectReview(review.id)}
                              >
                                Reconsider
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No {statusFilter} subject reviews found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewTabs;