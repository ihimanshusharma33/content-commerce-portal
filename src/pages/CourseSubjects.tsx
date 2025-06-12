import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Star, Users, Play } from 'lucide-react';
import { getCourseWithSubjects } from '@/services/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Subject {
  subject_id: number;
  subject_name: string;
  course_id: number;
  price: string;
  discount?: string;
  image?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  average_rating?: string;
  total_reviews?: number;
  chapter_count?: number;
}

interface CourseWithSubjects {
  id?: number;
  course_name: string;
  course_description?: string;
  price: string;
  discount?: string;
  semester: number;
  image: string;
  total_subjects: number;
  subjects: Subject[];
  total_users: number;
  overall_rating: string;
  total_review_count: number;
  is_purchased: boolean;
  expiry_days_left: number;
  createdAt?: string;
}

const CourseSubjects: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseWithSubjects | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        
        // Fetch course details with subjects using the correct function
        const courseData = await getCourseWithSubjects(parseInt(courseId));
        console.log('Course data:', courseData);
        
        setCourse(courseData);
        
        // Extract subjects from the course data
        if (courseData.subjects && Array.isArray(courseData.subjects)) {
          console.log('Subjects found:', courseData.subjects);
          setSubjects(courseData.subjects);
        } else {
          console.log('No subjects found in response');
          setSubjects([]);
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleSubjectClick = (subjectId: number) => {
    console.log('Card clicked - going to subject detail:', subjectId);
    // Card click goes to subject detail page
    navigate(`/subject/${subjectId}`);
  };

  const handleViewChaptersClick = (e: React.MouseEvent, subjectId: number) => {
    e.stopPropagation();
    console.log('Button clicked - going to chapters:', subjectId);
    // Button click goes directly to chapters/content
    navigate(`/chapter/${subjectId}/content`);
  };

  const renderStars = (rating: string | undefined) => {
    if (!rating) return null;
    
    const numRating = parseFloat(rating);
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < numRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          ({numRating.toFixed(1)})
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {course?.course_name || 'Course'} - Subjects
              </h1>
              <p className="text-gray-600">
                Choose a subject to view its chapters and content
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Info Card */}
      {course && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.course_name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.course_name}
                  </h2>
                  {course.course_description && (
                    <p className="text-gray-600 mb-3">{course.course_description}</p>
                  )}
                  <div className="flex items-center gap-4 mb-3">
                    <Badge variant="secondary">
                      Semester {course.semester}
                    </Badge>
                    <span className="text-lg font-semibold text-green-600">
                      ₹{course.price}
                    </span>
                    {course.discount && parseFloat(course.discount) > 0 && (
                      <span className="text-sm text-red-600">
                        Save ₹{course.discount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.total_users} students</span>
                    </div>
                    {course.overall_rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{parseFloat(course.overall_rating).toFixed(1)} ({course.total_review_count} reviews)</span>
                      </div>
                    )}
                    {course.is_purchased && (
                      <Badge className="bg-green-100 text-green-800">
                        Purchased - {course.expiry_days_left} days left
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subjects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {subjects.length > 0 ? (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Available Subjects ({subjects.length})
              </h3>
              <p className="text-gray-600">
                Click on any subject to view its chapters and start learning
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card
                  key={subject.subject_id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleSubjectClick(subject.subject_id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                          {subject.subject_name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {subject.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {subject.description}
                      </p>
                    )}
                    
                    {/* Rating */}
                    {subject.average_rating && (
                      <div className="mb-3">
                        {renderStars(subject.average_rating)}
                        {subject.total_reviews && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({subject.total_reviews} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      {subject.chapter_count && (
                        <div className="flex items-center gap-1">
                          <Play className="h-4 w-4" />
                          <span>{subject.chapter_count} chapters</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated {new Date(subject.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600">
                          ₹{subject.price}
                        </span>
                        {subject.discount && parseFloat(subject.discount) > 0 && (
                          <span className="text-sm text-red-600">
                            Save ₹{subject.discount}
                          </span>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="ml-auto"
                        onClick={(e) => handleViewChaptersClick(e, subject.subject_id)}
                      >
                        View Chapters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No subjects available
            </h3>
            <p className="text-gray-600 mb-6">
              This course doesn't have any subjects yet.
            </p>
            <Button onClick={() => navigate('/courses')} variant="outline">
              Browse Other Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSubjects;