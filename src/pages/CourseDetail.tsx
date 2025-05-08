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

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === id);
  const user = getCurrentUser();
  const isPurchased = user?.purchasedCourses.includes(id || '');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Show error if course not found
    if (!course && id) {
      toast("Course not found", {
        description: "The course you're looking for doesn't exist."
      });
      navigate('/courses');
    }
  }, [id, navigate, course]);
  
  if (!course) {
    return null; // Return early if course is not found
  }
  
  // Calculate course stats
  const totalLessons = course.lessons.length;
  const freeLessons = course.lessons.filter(lesson => lesson.isFree).length;
  
  // Handle purchase button click
  const handlePurchase = () => {
    if (!user) {
      toast("Authentication required", {
        description: "Please sign in or create an account to purchase this course."
      });
      navigate('/signin', { state: { redirectTo: `/course/${id}` } });
      return;
    }
    
    // Navigate to the payment page
    navigate(`/checkout/${id}`);
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
    navigate(`/course/${id}/content`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Payment Modal */}
      {course && (
        <PaymentModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          course={course}
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
                  {course.category}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {course.level}
                </Badge>
                {course.bestseller && (
                  <Badge className="bg-accent/90 hover:bg-accent text-white">
                    Bestseller
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl md:text-2xl font-bold mb-4">{course.title}</h1>
              
              <p className="text-xl mb-4">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-amber-500 font-semibold mr-1">{course.rating.toFixed(1)}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(course.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-gray-600">({course.reviewCount} reviews)</span>
                </div>
                
                <span className="text-gray-600">
                  {totalLessons} lessons ({course.duration})
                </span>
                
                <span className="text-gray-600">
                  Created by <span className="font-medium">{course.instructor}</span>
                </span>
              </div>
            </div>
            
            {/* Course Purchase Card */}
            <div className="lg:w-1/3">
              <Card className="p-4 sticky top-24">
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="mb-4">
                  {isPurchased ? (
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
                          ${(course.discountPrice || course.price).toFixed(2)}
                        </span>
                        {course.discountPrice && (
                          <span className="text-gray-500 line-through">
                            ${course.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {course.discountPrice && (
                        <div className="flex items-center mb-2 text-green-700">
                          <span className="font-medium">
                            {Math.round((1 - course.discountPrice / course.price) * 100)}% off
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {isPurchased ? (
                    <Button 
                      onClick={handleStartCourse}
                      className="w-full bg-primary mb-2"
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      onClick={handlePurchase}
                      className="w-full bg-primary text-white hover:bg-primary/90 mb-2"
                      size="lg"
                    >
                      Buy Now
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664l-3-2a1 1 0 00-1.414-1.414z"></path>
                    </svg>
                    <span className="text-gray-600">{course.duration} of content</span>
                  </div>
                  <div className="flex">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path>
                    </svg>
                    <span className="text-gray-600">{course.level}</span>
                  </div>
                  <div className="flex">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-gray-600">Certificate of completion</span>
                  </div>
                  <div className="flex">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span className="text-gray-600">Full lifetime access</span>
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
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <li key={item} className="flex">
                      <svg className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      <span>Learning objective {item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Course description</h2>
                <p className="mb-4">{course.description}</p>
                <p className="mb-4">
                  This course is designed for students who want to learn how to {course.category} from scratch. 
                  Whether you're a complete beginner or have some experience, this comprehensive course will 
                  take you from the basics to advanced concepts.
                </p>
                <p className="mb-4">
                  Throughout the course, you'll work on real-world projects that will help you apply what 
                  you've learned and build a portfolio of work. By the end of this course, you'll have the 
                  skills and confidence to create your own projects and advance your career.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Basic computer skills</li>
                  <li>No prior knowledge of {course.category} is required</li>
                  <li>A computer with internet connection</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="curriculum">
              <div>
                <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
                <div className="mb-4">
                  <p className="text-muted-foreground">
                    {totalLessons} lessons • {course.duration} total length • {freeLessons} free lessons
                  </p>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="section-1">
                    <AccordionTrigger className="text-lg font-medium">
                      Section 1: Introduction
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3">
                        {course.lessons.slice(0, 2).map((lesson) => (
                          <li key={lesson.id} className="flex items-center justify-between py-2 px-4 border-b">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span>{lesson.title}</span>
                              {lesson.isFree && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                  Free
                                </span>
                              )}
                            </div>
                            <span className="text-muted-foreground text-sm">{lesson.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="section-2">
                    <AccordionTrigger className="text-lg font-medium">
                      Section 2: Fundamentals
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3">
                        {course.lessons.slice(2).map((lesson) => (
                          <li key={lesson.id} className="flex items-center justify-between py-2 px-4 border-b">
                            <div className="flex items-center">
                              <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                              <span>{lesson.title}</span>
                              {lesson.isFree && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                  Free
                                </span>
                              )}
                            </div>
                            <span className="text-muted-foreground text-sm">{lesson.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
            
            <TabsContent value="instructor">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-6">Meet Your Instructor</h2>
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src="/placeholder.svg" 
                      alt={course.instructor}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{course.instructor}</h3>
                    <p className="text-muted-foreground mb-3">Instructor & Course Creator</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{course.rating.toFixed(1)} Instructor Rating</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                        </svg>
                        <span>10,000+ Students</span>
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path>
                        </svg>
                        <span>5 Courses</span>
                      </div>
                    </div>
                    
                    <p className="mb-4">
                      {course.instructor} is a professional educator and industry expert with over 10 years 
                      of experience in {course.category}. They have worked with leading companies and have 
                      taught thousands of students worldwide.
                    </p>
                    
                    <p>
                      Their teaching style focuses on practical, hands-on learning with real-world projects 
                      and examples. Students consistently praise their ability to explain complex concepts 
                      in a clear and accessible way.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
                
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="md:w-1/3 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-amber-500 mb-2">{course.rating.toFixed(1)}</div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          className={`w-6 h-6 ${i < Math.round(course.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground">{course.reviewCount} reviews</p>
                  </div>
                  
                  <div className="md:w-2/3">
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map(rating => {
                        // Calculate percentage for each rating level (just example data)
                        const percentage = rating === 5 ? 75 : 
                                          rating === 4 ? 18 : 
                                          rating === 3 ? 5 : 
                                          rating === 2 ? 1.5 : 0.5;
                        
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
                  {/* Sample reviews - these would come from a database in a real app */}
                  {[...Array(3)].map((_, i) => {
                    const rating = [5, 5, 4][i];
                    const names = ["Sarah Johnson", "Michael Lee", "Emily Rodriguez"];
                    const dates = ["May 2, 2023", "April 15, 2023", "March 30, 2023"];
                    const comments = [
                      "This course was exactly what I needed! The instructor explains concepts clearly and the projects are practical. I feel much more confident in my skills after completing this course.",
                      "Great course overall. The content is comprehensive and well-structured. I especially enjoyed the hands-on projects. A few sections could have been more in-depth, but I still learned a lot.",
                      "Solid introduction to the subject. While some sections were challenging for a beginner like me, the instructor was responsive in the Q&A section which helped me overcome obstacles."
                    ];
                    
                    return (
                      <div key={i} className="border-b pb-6">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="font-medium text-primary">{names[i][0]}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{names[i]}</h4>
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, j) => (
                                  <svg 
                                    key={j}
                                    className={`w-4 h-4 ${j < rating ? 'text-amber-400' : 'text-gray-300'}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground ml-2">{dates[i]}</span>
                            </div>
                          </div>
                        </div>
                        <p>{comments[i]}</p>
                      </div>
                    );
                  })}
                </div>
                
                {course.reviewCount > 3 && (
                  <div className="mt-6 text-center">
                    <Button variant="outline">See More Reviews</Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetail;
