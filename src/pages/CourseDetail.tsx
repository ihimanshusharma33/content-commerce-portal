import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courses, getCurrentUser, purchaseCourse } from '@/lib/data';
import { toast } from "@/components/ui/sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PaymentModal from '@/components/PaymentModal';
import apiClient from '@/utils/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseDetails } from '@/hooks/useCourseDetails';
import { Loader2 } from 'lucide-react';
import { getAssetUrl } from '@/services/apiService';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const course_or_subject = "course";

  const navigate = useNavigate();
  const user = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [reviews, setReviews] = useState([]);
  const { course, subjects, loading } = useCourseDetails(id, course_or_subject);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState(3);
  console.log(course);
  useEffect(() => {
    if (!id) return;

    apiClient.get(`/coursereviews/course/${id}`)
      .then(res => {
        const approvedReviews = res.data.data.filter((review: any) => review.is_approved === 1);
        setReviews(approvedReviews);
      })
      .catch(err => {
        console.error("Failed to fetch course reviews:", err);
      });
  }, [id]);

  // console.log(course);
  // console.log(subjects);

  // console.log(reviews);
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Show error if course not found
    if (!courses && id) {
      toast("Course not found", {
        description: "The course you're looking for doesn't exist."
      });
      navigate('/courses');
    }
  }, [id, navigate, course]);

  const handleReviewSubmit = () => {
    if (!reviewText || rating === 0) {
      toast("Please fill in all fields.");
      return;
    }

    apiClient.post('/coursereviews', {
      course_id: id,
      user_id: user.user.id,
      rating,
      review_description: reviewText
    })
      .then(() => {
        toast("Review submitted successfully!");
        setReviewText("");
        setRating(0);
      })
      .catch(err => {
        console.error(err);
        toast("Failed to submit review.");
      });
  };


  if (loading) return <div className="flex justify-center items-center min-h-screen">
    <Loader2 className="h-8 w-8 text-primary animate-spin mr-2" />
  </div>;


  if (!course) return <p>No course found.</p>;

  const handlePurchase = () => {
    if (!user || user === null) {
      toast("Authentication required", {
        description: "Please sign in or create an account to purchase this course."
      });
      navigate('/signin', { state: { redirectTo: `/course/${id}` } });
      return;
    }

    // Navigate to the payment page
    navigate(`/checkout/${course_or_subject}/${id}`);
  };

  // Handle successful payment
  const handlePaymentComplete = () => {
    purchaseCourse(course.id);

    // Re-render component to show updated purchase state
    window.dispatchEvent(new Event('storage'));
    // Navigate to content page
    navigate(`/course/${id}/content`);
  };

  const handleStartCourse = () => {
    navigate(`/chapter/${id}/content`);
  };
  // console.log(user.user.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Payment Modal */}
      {courses && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          course={courses}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      <div className="bg-secondary/20 py-10">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Info */}
            <div className="lg:w-2/3">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-secondary/80 hover:bg-secondary text-secondary-foreground">
                  Course
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  Subjects
                </Badge>
                {/* {course.bestseller && (
                  <Badge className="bg-accent/90 hover:bg-accent text-white">
                    Bestseller
                  </Badge>
                )} */}
              </div>

              <h1 className="text-2xl md:text-2xl font-bold mb-4">{course?.name || 'Loading Course Name...'}</h1>

              <p className="text-xl mb-4">{course?.description}</p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-amber-500 font-semibold mr-1">{course?.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(course?.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-gray-600">({course?.reviewCount} reviews)</span>
                </div>

                <span className="text-gray-600">
                  {course?.total_subjects} Subjects
                </span>

              </div>
            </div>

            {/* Course Purchase Card */}
            <div className="lg:w-1/3">
              <Card className="p-4 sticky top-24">
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                   <img
                                            src={getAssetUrl(course.image)}
                                            alt={course.name}
                                            className="h-full w-full object-fit transition-transform hover:scale-105 duration-300"
                                          />
            
                </div>

                <div className="mb-4">
                  {course.expiryDaysLeft == 0 && (
                    <>
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                        <div className="flex items-center text-red-800">
                          <span className="font-medium">Course Access has been Expired</span>
                        </div>
                      </div>
                    </>
                  )}
                  {course.isPurchased && course.expiryDaysLeft != 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                      <div className="flex items-center text-green-800">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="font-medium">You own this course</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold">
                          ${(course?.discountPrice || course?.price)}
                        </span>
                        {course?.discountPrice ? (
                          <span className="text-gray-500 line-through">
                            ${course?.price}
                          </span>
                        ):(<></>)}
                      </div>
                      {course?.discountPrice ? (
                        <div className="flex items-center mb-2 text-green-700">
                          <span className="font-medium">
                            {Math.round((1 - course?.discountPrice / course?.price) * 100)}% off
                          </span>
                        </div>
                      ):(<></>)}
                    </div>
                  )}

                  {course.isPurchased && course.expiryDaysLeft != 0 ? (
                    <Button onClick={handleStartCourse}
                      className="w-full bg-primary text-white hover:bg-primary/90 mb-2"
                      size="lg"
                    >
                      Start Course
                    </Button>
                  ) : (
                    <Button onClick={handlePurchase}
                      className="w-full bg-primary text-white hover:bg-primary/90 mb-2"
                      size="lg"
                    >
                      Buy Now - ₹{course?.price}
                    </Button>
                  )}

                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                    </svg>
                    <span className="text-gray-600">Course</span>
                  </div>
                  {/* <div className="flex">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-gray-600">Certificate of completion</span>
                  </div> */}
                  <div className="flex">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span className="text-gray-600">Expires in {course.expiryDaysLeft} Days </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-grow py-10">
        <div className="container-custom">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="Chapter">Subjects</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">


              <div>
                <h2 className="text-2xl font-bold mb-4">Course description</h2>
                <p className="mb-4">{course?.description}</p>
              </div>


            </TabsContent>

            <TabsContent value="Chapter">
              <div>
                <h2 className="text-2xl font-bold mb-6">Subject Chapter</h2>
                <div className="mb-4">
                  <p className="text-muted-foreground">
                    Total {course?.total_subjects} Subjects
                  </p>
                </div>

                {subjects.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {subjects.map((subject) => (
                      <AccordionItem key={subject.id} value={`subject-${subject.id}`}>
                        <AccordionTrigger className="text-lg font-medium">
                          {subject.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-4 space-y-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={getAssetUrl(subject.image)}
                                alt={subject.name}
                                className="w-16 h-16 object-cover rounded"
                              />

                              {/* Main content row */}
                              <div className="flex-1 w-full flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                  <p className="text-base font-semibold">{subject.name}</p>
                                  <p className="text-muted-foreground text-sm">
                                    Price: ₹{subject.price}
                                  </p>
                                </div>

                                <Button
                                  onClick={() => navigate(`/subject/${subject.id}`)}
                                  className="mt-2 md:mt-0"
                                >
                                  Go to Subject
                                </Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>

                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <h3 className="text-lg font-medium mb-2">No subjects found</h3>
                )}

              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="md:w-1/3 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-amber-500 mb-2">{course?.rating}</div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-6 h-6 ${i < Math.round(course?.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground">{reviews.length} reviews</p>
                  </div>

                  <div className="md:w-2/3">
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map(rating => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = reviews.length > 0 ? ((count / reviews.length) * 100).toFixed(1) : 0;

                        return (
                          <div key={rating} className="flex items-center">
                            <div className="flex items-center w-16">
                              <span>{rating}</span>
                              <svg className="w-4 h-4 ml-1 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </div>
                            <div className="flex-1 h-4 mx-2 bg-gray-200 rounded-full">
                              <div
                                className="h-4 bg-amber-400 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="w-12 text-right text-muted-foreground text-sm">
                              {percentage}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {reviews.length > 0 ? reviews.slice(0, visibleReviews).map((review) => (
                    <div key={review.review_id} className="border-b pb-6">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                         <span className="font-medium text-primary">{`${String(review.user.name).charAt(0).toUpperCase()}`}
</span>  </div>
                        <div>
                          <h4 className="font-medium"> {review.user.name}</h4>
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, j) => (
                                <svg
                                  key={j}
                                  className={`w-4 h-4 ${j < review.rating ? 'text-amber-400' : 'text-gray-300'}`}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p>{review.review_description}</p>
                    </div>
                  )) : (
                    <p className="text-muted-foreground">No  reviews yet.</p>
                  )}
                </div>

                {visibleReviews < reviews.length && (
                  <div className="text-center mt-4">
                    <Button variant="outline" onClick={() => setVisibleReviews(prev => prev + 3)}>
                      See More Reviews
                    </Button>
                  </div>
                )}
              </div>
              {course.isPurchased && course.expiryDaysLeft != 0 && (
                <div className="mt-10 bg-white shadow p-6 rounded-md">
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

                  <div className="mb-4">
                    <label className="block mb-2 font-medium">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <svg
                          key={num}
                          onClick={() => setRating(num)}
                          className={`w-8 h-8 cursor-pointer transition-colors ${num <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.158c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.538 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.783.57-1.838-.197-1.538-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.075 9.384c-.783-.57-.38-1.81.588-1.81h4.158a1 1 0 00.95-.69l1.286-3.957z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Your Review</label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full p-2 border rounded h-28"
                      placeholder="Write your thoughts here..."
                    />
                  </div>

                  <Button onClick={handleReviewSubmit}>Submit Review</Button>
                </div>
              )}

            </TabsContent>

          </Tabs>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
