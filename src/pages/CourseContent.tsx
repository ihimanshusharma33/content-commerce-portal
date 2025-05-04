
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { courses, isAuthenticated, getCurrentUser } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lesson } from '@/lib/data';

const CourseContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const user = getCurrentUser();
  const course = courses.find(c => c.id === id);
  const isPurchased = user?.purchasedCourses.includes(id || '');
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
      navigate('/signin', { state: { redirectTo: `/course/${id}/content` } });
      return;
    }
    
    // Redirect to course page if course doesn't exist
    if (!course) {
      navigate('/courses');
      return;
    }
    
    // Redirect to course page if not purchased and not free
    if (!isPurchased) {
      navigate(`/course/${id}`);
      return;
    }
    
    // Set first lesson as current by default
    if (course && course.lessons.length > 0 && !currentLesson) {
      setCurrentLesson(course.lessons[0]);
    }
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      setIsLoggedIn(isAuthenticated());
    };
    
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [course, currentLesson, id, isPurchased, navigate]);
  
  if (!isLoggedIn || !course || !isPurchased) {
    return null; // Will redirect
  }
  
  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };
  
  const currentLessonIndex = currentLesson ? course.lessons.findIndex(lesson => lesson.id === currentLesson.id) : 0;
  const prevLesson = currentLessonIndex > 0 ? course.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < course.lessons.length - 1 ? course.lessons[currentLessonIndex + 1] : null;
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Course Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container-custom py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate(`/course/${id}`)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </button>
              <h1 className="text-lg font-semibold truncate">{course.title}</h1>
            </div>
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Course Curriculum */}
        <aside 
          className={`bg-secondary/10 border-r w-full md:w-80 lg:w-96 flex-shrink-0 overflow-y-auto transition-all duration-300 ${
            isMenuOpen ? "fixed inset-0 z-40 md:relative" : "hidden md:block"
          }`}
        >
          <div className="p-4">
            <h2 className="font-semibold text-xl mb-4">Course Content</h2>
            <div className="space-y-1">
              {course.lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  className={`w-full text-left p-3 rounded-md flex items-start hover:bg-secondary/50 transition-colors ${
                    currentLesson?.id === lesson.id ? 'bg-secondary' : ''
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${currentLesson?.id === lesson.id ? 'text-primary' : ''}`}>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {currentLesson && (
            <div className="max-w-4xl mx-auto p-4 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                <p className="text-muted-foreground">{currentLesson.duration}</p>
              </div>

              {/* Video player (placeholder) */}
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-8">
                <div className="text-white text-center">
                  <svg className="w-16 h-16 mx-auto mb-3 text-white/70" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                  </svg>
                  <p className="text-lg font-medium">Video Player</p>
                  <p className="text-sm text-white/70">
                    In a real application, a video player would be displayed here.
                  </p>
                </div>
              </div>

              {/* Lesson content */}
              <div className="prose max-w-none">
                <h3>Lesson Content</h3>
                <p>
                  This is the content of the lesson. It would typically include text, images, code snippets, and other learning materials. The content would be specific to each lesson and would help students understand the concepts being taught.
                </p>
                <p>
                  In a real application, this content would be fetched from a database or content management system.
                </p>
                
                <h3>Key Points</h3>
                <ul>
                  <li>Important concept #1</li>
                  <li>Important concept #2</li>
                  <li>Important concept #3</li>
                </ul>
                
                <h3>Example</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <pre><code>{`// Example code
function example() {
  console.log("Hello, world!");
}

example();`}</code></pre>
                </div>
                
                <h3>Practice Exercise</h3>
                <p>
                  Try to implement the concepts you've learned in this lesson by completing the following exercise:
                </p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>Build a simple application that demonstrates the concepts from this lesson.</p>
                </div>
              </div>

              {/* Navigation buttons */}
              <Separator className="my-8" />
              <div className="flex justify-between">
                {prevLesson ? (
                  <Button 
                    variant="outline" 
                    onClick={() => handleLessonClick(prevLesson)}
                    className="flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Previous Lesson
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {nextLesson ? (
                  <Button 
                    onClick={() => handleLessonClick(nextLesson)}
                    className="flex items-center"
                  >
                    Next Lesson
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                    </svg>
                  </Button>
                ) : (
                  <Button onClick={() => navigate('/dashboard')}>
                    Complete Course
                  </Button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseContent;
